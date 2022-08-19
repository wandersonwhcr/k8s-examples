keycloak/certs/tls.crt: keycloak/certs/openssl.cnf keycloak/certs/tls.key
	openssl req \
		-new -days 365 -x509 \
		-config "$<" \
		-key "$(word 2, $^)" \
		-out "$@"

keycloak/certs/tls.key:
	openssl genrsa \
		-out "$@" \
		4096

.PHONY: clean
clean:
	${RM} \
		keycloak/certs/tls.crt \
		keycloak/certs/tls.key

.PHONY: info
info:
	openssl x509 \
		-noout -text \
		-certopt no_pubkey \
		-certopt no_sigdump \
		-in keycloak/certs/tls.crt
