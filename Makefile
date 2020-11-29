.PHONY: build
build:
	wasm-pack build --target nodejs --release
	rm pkg/.gitignore

.PHONY: clean
clean:
	rm -r pkg

.PHONY: all
all: clean build
	cd next && yarn