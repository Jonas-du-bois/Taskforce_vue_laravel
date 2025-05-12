<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de votre adresse email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5; text-align: center;">Confirmation de votre adresse email</h1>
        
        <p>Bonjour {{ $user->name }},</p>
        
        <p>Merci de vous être inscrit sur TaskForce. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ route('confirmation', ['token' => $user->verification_token]) }}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Confirmer mon email
            </a>
        </div>
        
        <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
        <p style="word-break: break-all; color: #4F46E5;">{{ route('confirmation', ['token' => $user->verification_token]) }}</p>
        
        <p>Ce lien expirera dans 24 heures.</p>
        
        <p>Si vous n'avez pas créé de compte sur TaskForce, vous pouvez ignorer cet email.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
    </div>
</body>
</html> 