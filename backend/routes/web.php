<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

// Route d'accueil
Route::get('/', [HomeController::class, 'index']);

// Route footer, contact, about, mentions légales   
Route::get('/contact', [HomeController::class, 'contact']);
Route::post('/sendContact', [HomeController::class, 'sendContact'])->name('contact.send');
Route::get('/about', [HomeController::class, 'about']);
Route::get('/mentions-legales', [HomeController::class, 'mentionsLegales']);

// Routes pour la connexion
Route::get('/login', [FormController::class, 'showLoginForm'])->name('showLoginForm');
Route::post('/login', [FormController::class, 'login']);
Route::post('/logout', [FormController::class, 'logout'])->name('logout');

// Routes pour le profil utilisateur (protégées par authentification)
Route::middleware(['auth'])->group(function() {
    // Profil
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    
    // Changement de mot de passe
    Route::get('/profile/password', [ProfileController::class, 'password'])->name('profile.password');
    Route::post('/profile/password', [FormController::class, 'changePassword'])->name('profile.password.update');
    
    // Gestion des tâches
    Route::get('/tasks', [TaskController::class, 'dashboard'])->name('tasks.dashboard');
    Route::get('/tasks/create', [TaskController::class, 'create'])->name('tasks.create');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasks.edit');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.updateStatus');
});

// Routes Admin
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/users/{user}', [AdminController::class, 'userDetails'])->name('users.details');
    Route::put('/users/{id}', [AdminController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser'])->name('users.delete');
});

// Route pour la confirmation de l'email
Route::get('confirmation/{token}', [RegisterController::class, 'confirmEmail'])->name('confirmation');

// Routes de vérification d'email
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('/')->with('success', 'Email vérifié avec succès !');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('success', 'Email de vérification envoyé !');
})->middleware(['auth', 'throttle:6,1'])->name('verification.resend');

// Routes pour l'inscription
Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register'])->name('register.submit');