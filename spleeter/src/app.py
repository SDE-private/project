# write a flask application

import spleeter_lib
import uvicorn
import json

from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel

class SplitSong(BaseModel):
    id: str

app = FastAPI()

@app.post("/")
async def create_upload_file(song: SplitSong):
  res = spleeter_lib.call_spleeter(song.id)
  return res

uvicorn.run(app, host='0.0.0.0', port=5000)
