<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'jonas.du.bois@outlook.com',
            'password' => Hash::make('password'),
            'is_admin' => true
        ]);
    }
}
