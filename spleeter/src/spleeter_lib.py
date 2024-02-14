import random
import string
import subprocess

from fastapi import UploadFile

OUTPUT_DIR = 'outputs/'
INPUT_DIR = 'inputs/'

def generate_random_string():
  return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))

def clean(input_path: str, output_path: str):
  subprocess.Popen(
    ['rm', input_path],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
  )
  subprocess.Popen(
    ['rm', '-rf', output_path],
    stdout=subprocess.PIPE, 
    stderr=subprocess.PIPE
  )

def spawn_spleeter(input_path: str):
  process = subprocess.Popen(
    ['spleeter', 'separate', '-p', 'spleeter:2stems', '-o', OUTPUT_DIR, input_path],
    stdout=subprocess.PIPE, 
    stderr=subprocess.PIPE
  )
  stdout, stderr = process.communicate()

def call_spleeter(name: str):
  input_path = INPUT_DIR + name + '.mp3'
  output_path = OUTPUT_DIR + name
  
  with open(input_path, 'wb') as f:
    f.write(file.file.read())

  spawn_spleeter(input_path)
  return {"result": "ok"}
