set -x
gcloud functions deploy compileAndSerializeComponent \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated