const { transform } = require('@babel/standalone');

exports.compileAndSerializeComponent = async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  // Check if the request is a POST request
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Get the code and name from the request body
  const { code, name } = req.body;

  if (!code || !name) {
    res.status(400).send('Missing code or name in request body');
    return;
  }

  try {
    const serializedComponent = serializeComponent(code, name);
    res.status(200).json({ serializedComponent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
};

function compileComponent(code, filename = 'component.tsx') {
  try {
    const result = transform(code, {
      filename,
      presets: [
        'react',
        ['typescript', { isTSX: true, allExtensions: true }],
      ],
      plugins: ['transform-modules-commonjs'],
    });
    return result.code;
  } catch (error) {
    throw error;
  }
}

function serializeComponent(code, name) {
  try {
    const compiledCode = compileComponent(code, `${name}.tsx`);
    if (!compiledCode) return null;

    return JSON.stringify({
      type: 'custom',
      name,
      code: compiledCode,
    });
  } catch (error) {
    throw error;
  }
}