# write a flask application

import spleeter_lib
import uvicorn
import json

from fastapi import FastAPI, File, UploadFile, Response
from fastapi.responses import JSONResponse
from requests_toolbelt import MultipartEncoder


app = FastAPI()

@app.post("/")
async def create_upload_file(name: str = Form(...)):
  res = spleeter_lib.call_spleeter(name)
  return res

uvicorn.run(app, host='0.0.0.0', port=5000)
