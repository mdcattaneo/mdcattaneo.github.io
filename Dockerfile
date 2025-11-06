# syntax=docker/dockerfile:1
FROM ruby:3.3

# Install dependencies required for building native extensions and Jekyll
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential nodejs git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /srv/jekyll

COPY Gemfile* ./
ENV BUNDLE_PATH=/usr/local/bundle
RUN bundle config set path "$BUNDLE_PATH" && \
    bundle install

COPY . .

EXPOSE 4000

# Use the local config by default so generated absolute URLs use localhost instead of 0.0.0.0
# Disable livereload by default to avoid the client attempting to connect to 0.0.0.0:35729
CMD ["bundle", "exec", "jekyll", "serve", "--config", "_config.yml,_config.local.yml", "--host", "0.0.0.0", "--watch"]
