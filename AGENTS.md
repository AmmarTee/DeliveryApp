# AGENTS
## Testing
Run these commands before committing changes:
- `docker-compose build web`
- `docker-compose run --rm web npm run lint`
- `docker-compose run --rm web npm run build`
- `docker-compose run --rm nlp pytest`
## Notes
- Use Docker-based workflows; ensure data persists via volumes.
