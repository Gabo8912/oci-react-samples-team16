FROM owasp/zap2docker-stable

COPY ./zap/start-scan.sh /zap/wrk/start-scan.sh
RUN chmod +x /zap/wrk/start-scan.sh

CMD ["bash", "/zap/wrk/start-scan.sh"]
