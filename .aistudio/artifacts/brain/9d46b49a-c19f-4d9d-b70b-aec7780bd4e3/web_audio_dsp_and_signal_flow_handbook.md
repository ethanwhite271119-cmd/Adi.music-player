# AuraSound Web Audio DSP & Signal Flow Handbook

## Document Metadata
- **Artifact Type**: Digital Signal Processing (DSP) & Acoustic Pipeline Handbook
- **Audio Context**: W3C Web Audio API (Hardware Accelerated Destination)
- **FFT Size**: 2048 samples (1024 discrete frequency bins)
- **Time Smoothing Constant**: 0.82
- **Dynamic Decibel Range**: -100 dBFS to -30 dBFS
- **Target Frame Rate**: 60 Hz (synchronized with requestAnimationFrame)

---

## 1. Fast Fourier Transform (FFT) Binning & Frequency Distribution

The Web Audio `AnalyserNode` computes the discrete Fourier transform of the incoming time-domain signal. With a sample rate $f_s = 48,000\,\text{Hz}$ and an FFT window size $N = 2048$:

### 1.1 Frequency Resolution per Bin

$$\Delta f = \frac{f_s}{N} = \frac{48,000\,\text{Hz}}{2048} \approx 23.4375\,\text{Hz / bin}$$

### 1.2 Human Auditory Perception & Logarithmic Binning

Human pitch perception is logarithmic (Weber-Fechner Law). Distributing 64 visualizer bars linearly across 1024 bins would allocate nearly all bars to high, inaudible or sparse harmonics while crunching the musical bass and midrange into only 2 or 3 bars. 

AuraSound applies an exponential frequency warp function:

$$k_i = \left\lfloor N_{\text{bins}} \cdot \left(\frac{i}{M}\right)^{2.4}\right\rfloor, \quad i \in [0, M-1]$$

Where:
- $M = 64$ (total display bars in the visualizer)
- $N_{\text{bins}} = 1024$ (Nyquist frequency bins up to $24\,\text{kHz}$)
- The exponent $2.4$ concentrates $45\%$ of visual bars into the fundamental musical range ($20\,\text{Hz} - 2,500\,\text{Hz}$).

---

## 2. Radial Visualizer Trigonometry & Canvas Rendering

In the expanded player modal and dynamic icon studio, AuraSound renders a 360-degree radial audio visualizer using standard 2D Canvas accelerated by GPU compositor layers.

```
                  270 deg (Top)
                       |
             . - ~ ~ ~ + ~ ~ ~ - .
         . '           |           ' .
       '               |               '
      '                |                '
180 deg ---------------o--------------- 0 deg (Right)
 (Left)                |
      '                |                '
       '               |               '
         . '           |           ' .
             . - ~ ~ ~ + ~ ~ ~ - .
                       |
                  90 deg (Bottom)
```

### 2.1 Vertex Position Equations

For each bar index $i \in [0, B-1]$ where $B = 72$:

$$\theta_i = \frac{2\pi \cdot i}{B} - \frac{\pi}{2}$$

Given inner base circle radius $R_0 = 90\,\text{px}$ and normalized frequency magnitude $A_i \in [0, 1]$:

$$L_i = A_i \cdot L_{\max}$$

The starting and ending coordinates of each radial spike are computed as:

$$\begin{aligned}
x_{\text{start}} &= c_x + R_0 \cdot \cos(\theta_i) \\
y_{\text{start}} &= c_y + R_0 \cdot \sin(\theta_i) \\
x_{\text{end}}   &= c_x + (R_0 + L_i) \cdot \cos(\theta_i) \\
y_{\text{end}}   &= c_y + (R_0 + L_i) \cdot \sin(\theta_i)
\end{aligned}$$

### 2.2 Dynamic Color Interpolation

The stroke color of each bar dynamically interpolates across a 3-stop gradient (Emerald Aurora -> Cyan Frost -> Magenta Pulse) modulated by total root-mean-square (RMS) energy:

$$\text{RMS} = \sqrt{\frac{1}{K}\sum_{j=0}^{K-1} s_j^2}$$

When $\text{RMS} > 0.65$ (representing a heavy bass kick or drop), the visualizer triggers a radial caustic ripple flash on the surrounding liquid glass container.

---

## 3. Logarithmic Fade Out & Sleep Timer Volume Curve

Linear attenuation of volume ($V(t) = V_0 \cdot (1 - t/T)$) feels perceptually unnatural to human ears because perceived loudness $L$ follows decibel scaling:

$$L_{\text{dB}} = 20 \log_{10}\left(\frac{P}{P_0}\right)$$

AuraSound executes smooth, imperceptible volume fade-outs during the final 15 seconds of a sleep timer cycle using the `AudioParam.exponentialRampToValueAtTime` equation:

$$V(t) = V_{\text{current}} \cdot \left(\frac{V_{\text{floor}}}{V_{\text{current}}}\right)^{\frac{t - t_0}{T_{\text{fade}}}}$$

Where:
- $V_{\text{floor}} = 0.0001$ (avoiding singularity at true zero)
- $T_{\text{fade}} = 15.0\,\text{seconds}$
- When $t = t_0 + T_{\text{fade}}$, the audio context is placed into suspended state (`audioCtx.suspend()`), preventing CPU wake-lock drain on mobile devices.

---

## 4. Latency Compensation & Buffer Starvation Recovery

When streaming remote audio over unpredictable mobile 4G/5G connections:
1. **Pre-roll Ring Buffer**: Audio chunks are buffered up to $12\,\text{seconds}$ ahead of current playback position.
2. **Underflow Detection**: If `audioElement.buffered.end(0) - audioElement.currentTime < 0.8\,\text{seconds}`, the player initiates micro-loop crossfade smoothing to conceal packet loss rather than issuing a harsh stutter or silence.
3. **Hardware Sample Rate Matching**: The `AudioContext` is explicitly initialized with `sampleRate: 48000` to avoid costly operating system hardware resampling on 99% of modern Android and desktop DACs.

---
*End of AuraSound Web Audio DSP & Signal Flow Handbook v3.4.0.*
