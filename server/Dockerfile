FROM gcc

WORKDIR /usr/src/myapp

COPY . /usr/src/myapp/

RUN gcc -o myapp myapp.c

CMD ["./myapp", "rm", "myapp"]

