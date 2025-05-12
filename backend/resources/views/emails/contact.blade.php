<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau message de contact</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5; text-align: center;">Nouveau message de contact</h1>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nom :</strong> {{ $data['name'] }}</p>
            <p><strong>Email :</strong> {{ $data['email'] }}</p>
            <p><strong>Message :</strong></p>
            <p style="white-space: pre-wrap;">{{ $data['message'] }}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
            Cet email a été envoyé depuis le formulaire de contact de TaskForce.
        </p>
    </div>
</body>
</html> 