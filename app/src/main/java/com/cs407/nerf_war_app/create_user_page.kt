package com.cs407.nerf_war_app

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class create_user_page : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_create_user_page)
        // Get references to UI elements
        val fullName = findViewById<EditText>(R.id.full_name)
        val email = findViewById<EditText>(R.id.email)
        val password = findViewById<EditText>(R.id.password)
        val confirmPassword = findViewById<EditText>(R.id.confirm_password)
        val createAccountButton = findViewById<Button>(R.id.create_account_button)

        // Set button click listener
        createAccountButton.setOnClickListener {
            // Simple validation
            if (password.text.toString() == confirmPassword.text.toString()) {
                // TODO: Perform account creation logic (e.g., save user data, navigate to home page, etc.)
                Toast.makeText(this, "Account Created Successfully!", Toast.LENGTH_SHORT).show()
                // You can redirect the user to another activity here
            } else {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
            }
        }
    }
}