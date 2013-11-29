build: index.js components
	@component build --dev

components:
	@component install --dev

clean:
	rm -rf build components

test:
	@mocha-phantomjs test/index.html

.PHONY: clean test