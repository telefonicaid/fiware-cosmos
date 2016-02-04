REPORTER = list
MOCHA_OPTIONS = --ui tdd

test:
	@clear
	@echo "***** STARTING TESTS *****"
	@./node_modules/mocha/bin/mocha --reporter $(REPORTER) $(MOCHA_OPTIONS) test/node/mysql_driver_test.js
	@./node_modules/mocha/bin/mocha --reporter $(REPORTER) $(MOCHA_OPTIONS) test/node/logger_test.js
	@echo "****** TESTS ENDED *******"

test-watch:
	@clear
	@echo "***** STARTING TESTS *****"
	@./node_modules/mocha/bin/mocha --reporter $(REPORTER) --growl --watch $(MOCHA_OPTIONS) test/*.js
	@echo "****** TESTS ENDED *******"

.PHONY: test test-watch
