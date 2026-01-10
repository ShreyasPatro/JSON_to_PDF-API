## PDF Generation API Documentation

This documentation provides comprehensive details for the PDF Generation API, covering management of templates and dynamic PDF creation.

---

### 1. Authentication

Currently, the API **does not require authentication** for any endpoints. It is intended for use within a secure internal network or behind a reverse proxy that handles authorization.

* **Future Note:** Implementation of `API_KEY` or `JWT` headers is planned for future releases to secure public-facing instances.

---

### 2. API Endpoints

#### **Template Management**

These endpoints handle the persistence of HTML blueprints in the `data/templates.json` file.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/templates` | Create and persist a new PDF template. |
| `GET` | `/api/templates` | Retrieve a list of all stored templates. |
| `GET` | `/api/templates/:id` | Get details for a specific template by ID. |
| `PUT` | `/api/templates/:id` | Update HTML, CSS, or name of an existing template. |
| `DELETE` | `/api/templates/:id` | Permanently remove a template from storage. |

#### **PDF Generation**

These endpoints handle the conversion of content into binary PDF files.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/generate` | Generate PDF using a `templateId` and a `data` object for variable injection. |
| `POST` | `/api/generate-html` | Generate PDF directly from raw HTML and CSS strings. |

---

### 3. Request Body Schemas

#### **Create Template (`POST /api/templates`)**

```json
{
  "id": "invoice-v1",
  "name": "Standard Invoice",
  "html": "<html><body><h1>Invoice for {{clientName}}</h1></body></html>",
  "css": "h1 { color: navy; }"
}

```

#### **Generate from Template (`POST /api/generate`)**

Supports nested data objects using dot notation (e.g., `{{user.name}}`).

```json
{
  "templateId": "invoice-v1",
  "data": {
    "clientName": "John Doe",
    "amount": "1200.00"
  },
  "options": {
    "format": "A4",
    "landscape": false
  }
}

```

#### **Generate from Raw HTML (`POST /api/generate-html`)**

```json
{
  "html": "<h1>One-off Report</h1>",
  "css": "h1 { font-family: sans-serif; }",
  "options": { "printBackground": true }
}

```

---

### 4. Response Formats

#### **Success (Template Metadata)**

Returns the template object with generated timestamps.

```json
{
  "message": "Template created successfully",
  "data": {
    "id": "invoice-v1",
    "name": "Standard Invoice",
    "createdAt": "2026-01-10T15:00:00.000Z",
    "updatedAt": "2026-01-10T15:00:00.000Z"
  }
}

```

#### **Success (PDF Generation)**

* **Content-Type:** `application/pdf`
* **Body:** Binary PDF buffer.
* **Header:** `Content-Disposition: attachment; filename="template_name.pdf"`

#### **Error (Validation or Logic)**

```json
{
  "error": "Generation Failed",
  "message": "Template with ID \"invoice-v1\" not found."
}

```

---

### 5. HTTP Status Codes

| Code | Meaning | Usage |
| --- | --- | --- |
| `200` | OK | Successful GET, PUT, DELETE, or PDF generation. |
| `201` | Created | Successful POST to `/api/templates`. |
| `400` | Bad Request | Missing required fields (id, name, html). |
| `404` | Not Found | Requested `templateId` does not exist. |
| `409` | Conflict | Attempting to create a template with an existing ID. |
| `429` | Too Many Requests | Rate limit exceeded. |
| `500` | Server Error | Puppeteer/Browser crash or file system failure. |

---

### 6. Rate Limiting

The API implements a global rate limiter for all `/api/` routes to prevent resource exhaustion from Puppeteer instances.

* **Default Limit:** 100 requests per 15-minute window.
* **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` are included in all responses.

---

### 7. Quick Start Guide

1. **Install and Start:**
```bash
npm install
node server.js

```


2. **Register a Template:**
Use a POST request to `/api/templates` to save your HTML layout.
3. **Generate your PDF:**
Call `/api/generate` with the `templateId` and your dynamic `data` object.
