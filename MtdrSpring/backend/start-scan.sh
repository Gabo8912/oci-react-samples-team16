#!/bin/bash

TARGET="http://localhost:8081"

zap-baseline.py -t $TARGET -g gen.conf -r zap-report.html

echo "ZAP scan completed. Report saved as zap-report.html"
