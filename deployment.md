To prepare your PDF API for a commercial launch, this `DEPLOYMENT.md` file provides the technical roadmap for moving from your local Docker environment to professional cloud hosting.

---

### 1. Pre-Deployment Checklist

Before pushing to any production environment, ensure the following are configured:

* **Environment Variables**: Verify that `NODE_ENV=production`, `PORT`, `RATE_LIMIT_MAX`, and `RATE_LIMIT_WINDOW_MS` are set in your production dashboard.
* **Puppeteer Flags**: Ensure `utils/browserManager.js` includes `--no-sandbox` and `--disable-dev-shm-usage` to prevent crashes in containerized Linux environments.
* **Data Persistence**: If using the local JSON store, ensure the `/data` volume is mapped to persistent storage; otherwise, templates will be lost on redeploy.
* **Secrets**: If you add API Keys or Database URLs later, never hardcode them; use the provider's Secret Manager.

---

### 2. Deployment to Railway (Easiest)

Railway is highly recommended for this project because it detects your `Dockerfile` automatically.

1. **Connect GitHub**: Connect your repository to a new project on [Railway.app](https://railway.app/).
2. **Automatic Detection**: Railway will see the `Dockerfile` and start the build.
3. **Variables**: Go to the **Variables** tab and add your `.env` key-value pairs.
4. **Persistent Volume**:
* Go to **Settings** > **Volumes**.
* Create a volume and mount it to `/usr/src/app/data`. This ensures your `templates.json` survives updates.



---

### 3. Deployment to Render

Render is a great alternative that supports Web Services with Docker.

1. **New Web Service**: Connect your GitHub repo.
2. **Environment**: Select **Docker** as the Runtime.
3. **Plan**: Choose a plan with at least **1GB RAM** (Puppeteer/Chromium is memory-intensive).
4. **Advanced**: Add a **Disk** to mount at `/usr/src/app/data` for persistent template storage.
5. **Health Check Path**: Set to `/health`.

---

### 4. Deployment to AWS ECS (Enterprise Scaling)

For high-volume production, use Amazon Elastic Container Service (ECS) with Fargate.

1. **Push to ECR**: Push your Docker image to **Amazon Elastic Container Registry**.
2. **Task Definition**:
* Assign at least **0.5 vCPU** and **2GB RAM**.
* Set the `PUPPETEER_EXECUTABLE_PATH` environment variable.


3. **Storage**: Use **Amazon EFS** (Elastic File System) mounted to `/usr/src/app/data` if you want to share templates across multiple container instances.
4. **Load Balancer**: Place the service behind an **Application Load Balancer (ALB)** on port 3000.

---

### 5. Post-Deployment Verification

Once the status is "Healthy," run these checks:

1. **Health Check**: Access `https://your-app-url.com/health`.
2. **Template Persistence**: Create a test template, restart the service/redeploy, and verify the template still exists via `GET /api/templates`.
3. **Cold Start PDF**: Generate a PDF via `/api/generate-html` to ensure the Chromium binary launches correctly in the new environment.

---

### 6. Monitoring Recommendations

* **Log Management**: Use **Loki** (Grafana) or **CloudWatch** to monitor "Browser Disconnected" warnings in your logs.
* **Metrics**: Track **Memory Usage**. If it climbs steadily, it indicates a memory leak (usually from not closing pages/browsers).
* **Alerts**: Set up a "Heartbeat" alert for the `/health` endpoint to notify you of downtime.

---

### 7. Scaling Considerations

* **Horizontal Scaling**: You can run multiple instances of this API. However, since Puppeteer is heavy, it is often better to scale **out** (more small instances) than **up** (one giant instance).
* **Shared Storage**: When scaling horizontally, you **must** move from `templates.json` to a database (MongoDB/Postgres) so all instances see the same templates.
* **Sticky Sessions**: Not required, as the API is stateless (except for the template storage).

---

### 8. Troubleshooting Common Issues

* **`Error: Failed to launch the browser process!`**: Usually a missing Linux library. Ensure your `Dockerfile` uses the `apk add` commands provided in our build.
* **`TimeoutError`**: PDF generation took longer than 30 seconds. This happens if the HTML is too large or has many external images.
* **`429 Too Many Requests`**: Your rate limit is too strict for production. Increase `RATE_LIMIT_MAX` in your environment variables.


