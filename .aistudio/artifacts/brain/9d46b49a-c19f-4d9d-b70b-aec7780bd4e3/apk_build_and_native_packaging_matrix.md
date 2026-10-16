# AuraSound Android APK Packaging & Native Bridge Matrix

## Document Metadata
- **Artifact Type**: Native Android Engineering & Build Matrix
- **Package Identifier**: `com.aurasound.musicplayer`
- **Minimum SDK**: API Level 26 (Android 8.0 Oreo)
- **Target SDK**: API Level 34 (Android 14 Upside Down Cake)
- **NDK Version**: 26.1.10909125 (High-performance C++ Oboe / AAudio audio pipe)
- **Document Status**: Production Verified

---

## 1. Native Build Toolchain Architecture

AuraSound is architected to compile from a hybrid TypeScript/Vite modern frontend into an optimized, high-performance Android APK or Android App Bundle (AAB).

```
+-----------------------------------------------------------------------------------+
|                            VITE FRONTEND ASSETS (/dist)                           |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        CAPACITOR / CORDOVA NATIVE BRIDGE                          |
|  - Custom WebChromeClient (Hardware Accelerated Canvas & WebGL)                   |
|  - In-Process AssetLoader (http://localhost / capacitor://)                      |
|  - Zero-Copy Local File System ContentResolver Bridge                             |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     NATIVE ANDROID MEDIA SUBSYSTEM (MEDIA3)                       |
|  - androidx.media3.session.MediaSession                                           |
|  - androidx.media3.exoplayer.ExoPlayer / AAudio (C++ Oboe Engine)                 |
|  - AudioAttributes.USAGE_MEDIA / CONTENT_TYPE_MUSIC                               |
|  - NotificationManagerCompat (Lock screen controls & seekable scrubber)           |
+-----------------------------------------------------------------------------------+
```

---

## 2. Complete Production build.gradle (Module: app)

```groovy
plugins {
    id 'com.android.application'
    id 'kotlin-android'
    id 'kotlin-kapt'
}

android {
    namespace "com.aurasound.musicplayer"
    compileSdk 34

    defaultConfig {
        applicationId "com.aurasound.musicplayer"
        minSdk 26
        targetSdk 34
        versionCode 30400
        versionName "3.4.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        
        ndk {
            abiFilters 'armeabi-v7a', 'arm64-v8a', 'x86_64'
        }
        
        manifestPlaceholders = [
            appName: "AuraSound APK",
            appScheme: "aurasound"
        ]
    }

    signingConfigs {
        release {
            storeFile file("keystore/aurasound-release.jks")
            storePassword System.getenv("AURASOUND_KEYSTORE_PASSWORD")
            keyAlias System.getenv("AURASOUND_KEY_ALIAS")
            keyPassword System.getenv("AURASOUND_KEY_PASSWORD")
            v1SigningEnabled true
            v2SigningEnabled true
            v3SigningEnabled true
        }
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
            ndk {
                debugSymbolLevel 'SYMBOL_TABLE'
            }
        }
        preview {
            initWith release
            applicationIdSuffix ".preview"
            versionNameSuffix "-preview"
            debuggable true
            minifyEnabled false
        }
        liquidMod {
            initWith release
            applicationIdSuffix ".liquid"
            versionNameSuffix "-liquidmod"
            buildConfigField "boolean", "ENABLE_EXPERIMENTAL_SHADERS", "true"
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    buildFeatures {
        viewBinding true
        buildConfig true
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    
    // AndroidX & Core
    implementation 'androidx.core:core-ktx:1.13.1'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.12.0'
    implementation 'androidx.webkit:webkit:1.11.0'

    // Media3 (ExoPlayer + MediaSession for Android 14 lockscreen & Auto)
    implementation 'androidx.media3:media3-exoplayer:1.3.1'
    implementation 'androidx.media3:media3-session:1.3.1'
    implementation 'androidx.media3:media3-ui:1.3.1'
    implementation 'androidx.media3:media3-common:1.3.1'

    // Oboe High-Performance Audio Engine (Native C++ / JNI wrapper)
    implementation 'com.google.oboe:oboe:1.8.0'

    // Kotlin Coroutines for Non-Blocking IO
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0'
}
```

---

## 3. High-Security ProGuard & R8 Optimization Rules (`proguard-rules.pro`)

```proguard
# Preserve Web Audio Javascript Interfaces & Native Reflection
-keepattributes *Annotation*
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve Media3 MediaSession Service & Player Callbacks
-keep class androidx.media3.** { *; }
-keep interface androidx.media3.** { *; }
-dontwarn androidx.media3.**

# Oboe C++ Native Bridge
-keepclasseswithmembernames class * {
    native <methods>;
}

# Preserve Data Models Serialized Across Web <-> Native JSON
-keepclassmembers class com.aurasound.musicplayer.models.** {
    <fields>;
    <methods>;
}

# Aggressive dead code elimination for Webkit wrappers
-repackageclasses 'com.aurasound.musicplayer.obf'
-allowaccessmodification
-mergeinterfacesaggressively
```

---

## 4. Android 14 Foreground Audio Service Implementation

```kotlin
package com.aurasound.musicplayer.playback

import android.app.Notification
import android.app.PendingIntent
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import com.aurasound.musicplayer.MainActivity
import com.aurasound.musicplayer.R

class AuraMediaSessionService : MediaSessionService() {
    private var mediaSession: MediaSession? = null
    private lateinit var player: ExoPlayer

    override fun onCreate() {
        super.onCreate()
        player = ExoPlayer.Builder(this)
            .setAudioAttributes(
                androidx.media3.common.AudioAttributes.Builder()
                    .setContentType(androidx.media3.common.C.AUDIO_CONTENT_TYPE_MUSIC)
                    .setUsage(androidx.media3.common.C.USAGE_MEDIA)
                    .build(),
                true
            )
            .setHandleAudioBecomingNoisy(true)
            .build()

        val sessionActivityPendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )

        mediaSession = MediaSession.Builder(this, player)
            .setSessionActivity(sessionActivityPendingIntent)
            .build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? {
        return mediaSession
    }

    override fun onDestroy() {
        mediaSession?.run {
            player.release()
            release()
            mediaSession = null
        }
        super.onDestroy()
    }
}
```

---

## 5. Adaptive Launcher Icon Geometry Matrix

Android 8.0+ devices demand adaptive icons consisting of a background vector layer and a foreground vector emblem. The launcher applies an adaptive viewport mask dynamically:

| Target Launcher Geometry | Mask Inset (%) | Visual Center Offset | Safe Zone Circle |
| :--- | :--- | :--- | :--- |
| **Squircle** (Samsung OneUI / Pixel) | 8% | (0.0, 0.0) | 66dp of 108dp canvas |
| **Pure Circle** (AOSP / Stock Pixel) | 10% | (0.0, 0.0) | 66dp of 108dp canvas |
| **Rounded Square** (Xiaomi MIUI / HyperOS)| 6% | (0.0, 0.0) | 72dp of 108dp canvas |
| **Teardrop** (Motorola / Custom ROMs) | 12% | (0.0, -2.0dp) | 64dp of 108dp canvas |

---

## 6. Sideloading Verification & SHA-256 Fingerprint Management

When distributing APKs outside the Google Play Store (direct GitHub release or AuraSound in-app download):

1. **APK Signature Scheme v3**: Ensures tamper-resistance by embedding the key rotation proof-of-rotation record directly in the APK Signing Block.
2. **Play Protect SafetyNet / Integrity API**: Pre-flight verification hashes checked against Google Cloud Integrity API to avoid "Unrecognized Developer" dialogs.
3. **App Bundle Universal APK Generation Command**:
   ```bash
   bundletool build-apks \
     --bundle=aurasound-release.aab \
     --output=aurasound-universal.apks \
     --mode=universal \
     --ks=keystore/aurasound-release.jks \
     --ks-pass=pass:$KEYSTORE_PASS
   ```

---
*End of AuraSound Android APK Packaging & Native Bridge Matrix v3.4.0.*
