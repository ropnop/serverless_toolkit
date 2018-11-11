#!/bin/bash

if [ -z "${GOTTY_CREDENTIALS}" ]; then
  /usr/local/bin/gotty -w --reconnect /bin/bash
else
  /usr/local/bin/gotty -w --reconnect -c "${GOTTY_CREDENTIALS}" /bin/bash
fi
