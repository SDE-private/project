FROM ubuntu:18.04
ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"
RUN apt-get update

RUN apt-get install -y wget && rm -rf /var/lib/apt/lists/*

RUN wget \
    https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && mkdir /root/.conda \
    && bash Miniconda3-latest-Linux-x86_64.sh -b \
    && rm -f Miniconda3-latest-Linux-x86_64.sh 
RUN conda --version

RUN conda install python=3.8 -y

RUN conda install -c conda-forge ffmpeg libsndfile -y

RUN pip install spleeter

RUN pip install fastapi uvicorn python-multipart requests_toolbelt

EXPOSE 5000

COPY src/ /app

WORKDIR /app

CMD ["python", "app.py"]