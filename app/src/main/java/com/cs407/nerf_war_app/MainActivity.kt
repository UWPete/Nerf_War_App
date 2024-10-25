package com.cs407.nerf_war_app

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Find the Sign In button and set a click listener to navigate to welcome page
        val signInButton = findViewById<Button>(R.id.sign_in_button)
        signInButton.setOnClickListener {
            // Create an Intent to navigate to HomePageActivity (home_page.kt)
            val intent = Intent(this, home_page::class.java)
            startActivity(intent)  // Start the new activity
        }

        // Find the Create User button and set a click listener to navigate to create user page
        val newUserButton = findViewById<Button>(R.id.create_user_button)
        newUserButton.setOnClickListener {
            // Create an Intent to navigate to HomePageActivity (home_page.kt)
            val intent = Intent(this, create_user_page::class.java)
            startActivity(intent)  // Start the new activity
        }
    }
}