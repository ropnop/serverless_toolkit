#!/bin/bash

GOTTY=$(which gotty || /usr/local/bin/gotty)

[ -z "${GOTTY_CREDENTIALS}" ] && OPTS="-c ${GOTTY_CREDENTIALS}"
${GOTTY} -w --reconnect ${OPTS} $@ /bin/bash
