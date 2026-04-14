# RemindMe Backend (Notify App Update)

## Required environment variables

- `APP_ACTIONS_SECRET` (**required**): shared secret used by GitHub Actions and backend route.
- `APP_DEEP_LINK_URL` (optional): deep link URL placed in notification payload data.
  - Default fallback in code: `remindme://`.

## Endpoint

- `POST /api/notify-app-update`
  - Header: `x-github-actions-secret: <APP_ACTIONS_SECRET>`
  - JSON body (optional):
    - `message`
    - `platform` (`android` | `ios` | `all`)
    - `branch`
