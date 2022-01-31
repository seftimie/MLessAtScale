# DECLARE ALL VARS
GCP_PROJECT_ID=""
GCP_BUCKET=""
BQ_DATASET_ID=""
BQ_MODEL=""
BQ_LOCATION=""
BQ_FORMAT=""
RUN_LOCATION=""
RUN_NAME=""
DOCKERFILE_ML=""
SA_EMAIL=""
SA_JSON=""

# Activate service account inside container
gcloud auth activate-service-account ${SA_EMAIL} --key-file={SA_JSON}

# (todo) BQML: create and train the model 
# eg: https://www.cloudskillsboost.google/focuses/1794?parent=catalog

# EXPORT BQ MODEL TO STORAGE
bq --location=${BQ_LOCATION} extract --destination_format ${BQ_FORMAT}  --model ${GCP_PROJECT_ID}:${BQ_DATASET_ID}.${BQ_MODEL} ${GCP_BUCKET}

# DEPLOY MODEL INTO CLOUD RUN
mkdir /models/tf_models/model/00000001/;
gsutil cp -r ${GCP_BUCKET}/* /models/tf_models/model/00000001/ ;
wget -O Dockerfile ${DOCKERFILE_ML} ;
gcloud builds submit --project=${GCP_PROJECT_ID} --tag gcr.io/${GCP_PROJECT_ID}/${RUN_NAME} ;
gcloud run deploy ${RUN_NAME} --project=${GCP_PROJECT_ID} --image gcr.io/${GCP_PROJECT_ID}/${RUN_NAME} --platform managed --region ${RUN_LOCATION} --allow-unauthenticated;
gcloud run services add-iam-policy-binding ${RUN_NAME} --project=${GCP_PROJECT_ID} --region ${RUN_LOCATION} --member="allUsers" --role="roles/run.invoker"