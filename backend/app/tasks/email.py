from app.tasks.celery_app import celery_app

@celery_app.task(name="app.tasks.email.send_email")
def send_email(to: str, subject: str, body: str):
    # Stub: integrate actual email provider (SMTP/API)
    print(f"Sending email to {to}: {subject}\n{body}")
    return True

@celery_app.task(name="app.tasks.email.send_email_with_attachment")
def send_email_with_attachment(to: str, subject: str, body: str, attachment_b64: str, filename: str = "receipt.pdf"):
    # Stub: log the email with attachment info. In production, decode base64 and attach in SMTP/API call.
    size_kb = round(len(attachment_b64) * 3 / 4 / 1024, 2)
    print(f"Sending email to {to}: {subject} with attachment {filename} ({size_kb} KB)")
    return True
