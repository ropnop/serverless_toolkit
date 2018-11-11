FROM dit4c/gotty

RUN apk add --update nmap nmap-ncat socat openssh bash && \
  rm -rf /var/cache/apk/*

ADD run.sh /run.sh
RUN chmod +x /run.sh
ENTRYPOINT ["/run.sh"]
