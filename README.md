#     <!-- Essential Media Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="AuraSound APK"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AuraSound.LiquidDark"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".playback.AuraMediaSessionService"
            android:exported="false"
            android:foregroundServiceType="mediaPlayback">
            <intent-filter>
                <action android:name="androidx.media3.session.MediaSessionService" />
            </intent-filter>
        </service>
    </application>
</manifest>
```

### 5.2 Build Profiles & Variant Matrix

| Build Variant | Min SDK | Target SDK | ProGuard / R8 | Output Artifact | Primary Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Release** | API 26 (Android 8.0) | API 34 (Android 14) | Aggressive Tree-shaking | `aurasound-v3.4.0-release.apk` | Production Play Store & Direct Sideload |
| **Preview** | API 28 (Android 9.0) | API 34 (Android 14) | Debug Symbols Preserved | `aurasound-v3.4.0-preview.apk` | Beta Testing & Telemetry Audit |
| **Liquid MOD** | API 26 (Android 8.0) | API 34 (Android 14) | Shader Experimental | `aurasound-v3.4.0-liquidmod.apk` | Enthusiast Build with High Refraction |

---

## 6. Ephemeral Guest Identity & Privacy Vault

Recognizing that users frequently access web audio platforms on shared computers or untrusted environments, AuraSound defaults to a dedicated **Guest Listener Profile**:

- **No Remote Credential Leakage**: No mandatory Google login or tracking cookies.
- **Incognito Playback History**: Toggleable state preventing listening sessions from being persisted to long-term storage.
- **Session Duration Metrics**: In-memory session minutes tracking with automated cache invalidation after 48 hours of inactivity.
- **Cryptographic Tag Generation**: Pseudorandom guest identifiers formatted as `#XXXX` derived from a deterministic seed for visual consistency across refreshes.

---

## 7. Sleep Timer State Machine & Graceful Fade-Out

The sleep timer architecture prevents abrupt audio cut-offs that disrupt user rest.

```
+---------------+
|    IDLE       |
+---------------+
        |
        | [User sets timer (e.g. 30m / End of Track)]
        v
+---------------+
|   COUNTDOWN   | <--- 1Hz System Clock Tick
+---------------+
   |         |
   |         +--- [If remainingSeconds <= 15s] ---> Apply Logarithmic Attenuation
   |
   +--- [If remainingSeconds == 0 OR Track Ends]
             |
             v
      +---------------+
      |    EXPIRED    | ---> Pause Web Audio Context -> Show Toast Notification
      +---------------+
```

---

## 8. Complete System API & Interface Catalog

```typescript
// 1. Audio Engine Contract
export interface IAudioEngine {
  playTrack(track: Track): Promise<void>;
  pause(): void;
  resume(): void;
  seek(seconds: number): void;
  setVolume(vol: number): void;
  getFrequencyData(): Uint8Array;
  setCallbacks(callbacks: AudioEngineCallbacks): void;
}

// 2. APK Configuration Contract
export interface ApkConfig {
  name: string;
  packageName: string;
  version: string;
  buildType: 'Release' | 'Preview' | 'Liquid MOD';
  showApkBadgeOnHome: boolean;
  launcherIconShape: 'squircle' | 'circle' | 'rounded' | 'teardrop';
  lastModified: number;
}

// 3. User Profile Vault
export interface UserProfile {
  id: string;
  type: 'guest' | 'member';
  displayName: string;
  guestTag: string;
  avatarSeed: string;
  incognitoHistory: boolean;
  sessionMinutes: number;
  favoriteTrackIds: string[];
  listeningHistory: { trackId: string; playedAt: number }[];
  createdAt: number;
}
```

---

## 9. Comprehensive Engineering Roadmap & Scaling Targets

1. **Phase 1: WebRTC Local Device Sync**: Enable P2P local file synchronization between Android APK devices on the same local Wi-Fi subnet without routing through external servers.
2. **Phase 2: WASM-Powered DSP Equalizer**: Migrate Web Audio Biquad filters to a WebAssembly compiled Rust DSP core providing 32-band graphic equalization and spatial convolution reverb.
3. **Phase 3: OPUS Hybrid Transcoding**: On-the-fly client-side transcoding of high-bitrate WAV/FLAC audio to lightweight OPUS packets for low-latency background streaming.
4. **Phase 4: Standalone Android App Bundle (AAB)**: Direct compilation via Capacitor/Tauri mobile bridge into unsigned `.aab` artifacts ready for automated Play Console deployment.

---
*End of AuraSound Comprehensive Architecture Specification v3.4.0.*
