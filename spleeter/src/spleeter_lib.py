import random
import string
import subprocess
import glob

from fastapi import UploadFile

OUTPUT_DIR = '/media/'
INPUT_DIR = '/media/'

def generate_random_string():
  return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))

def spawn_spleeter(input_path: str):
  process = subprocess.Popen(
    ['spleeter', 'separate', '-p', 'spleeter:5stems', '-o', OUTPUT_DIR, '-c', 'mp3', input_path],
    stdout=subprocess.PIPE, 
    stderr=subprocess.PIPE
  )
  stdout, stderr = process.communicate()

def read_output(output_path: str):
  output = {}
  for file in glob.glob(output_path + '/*.mp3'):
    what = file.split('/')[-1].split('.')[0]
    output[what] = file
  return output

def call_spleeter(song_id: str):
  input_path = INPUT_DIR + song_id + '.mp3'
  output_path = OUTPUT_DIR + song_id
  print(f"Song id: {input_path}")
  
  spawn_spleeter(input_path)

  output = read_output(output_path)
  
  return {"stems": output}
