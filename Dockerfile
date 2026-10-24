FROM oven/bun:1.4.4-alpine@sha256:4cf82f5686b196504fe119db3fcd9185b191f82ece82c40680e597228ec6070a AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM golang:1.27.3-alpine@sha256:b8c9b82affbbb82a020bbcf998dad2ba9516944ac7e883524642a481a9505e9c AS runtime-build
WORKDIR /src
COPY runtime/health/ ./
RUN go test ./... && CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /portfolio-runtime .

FROM nginx/nginx-unprivileged:1.31.7-alpine@sha256:bc2c6cf6c2ec2ca26ee495cb23e4599adc8a5d0b90abbd5621c4605abc59ddd5
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=runtime-build /portfolio-runtime /usr/local/bin/portfolio-runtime
COPY --from=build --chown=101:101 /app/dist /usr/share/nginx/html
# Bypass the upstream entrypoint's config mutation; only /tmp needs a tmpfs.
USER 101:101
ENTRYPOINT ["/usr/local/bin/portfolio-runtime"]
CMD []
STOPSIGNAL SIGTERM
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
