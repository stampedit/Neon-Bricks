/**
 * Particle Effects System for STACKS Game
 * Handles all particle effects and visual feedback
 */
class ParticleSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
        this.maxParticles = 200;
        
        // Particle types with different behaviors
        this.types = {
            EXPLOSION: 'explosion',
            COMBO: 'combo',
            PERFECT: 'perfect',
            TRAIL: 'trail',
            SPARKLE: 'sparkle',
            SMOKE: 'smoke',
            FLOATING_TEXT: 'floating_text',
            MEGA_EXPLOSION: 'mega_explosion',
            RAINBOW_BURST: 'rainbow_burst',
            SCREEN_FLASH: 'screen_flash'
        };
        
        // Color palettes for different effects
        this.colors = {
            explosion: ['#FF6B6B', '#FF8E53', '#FFA500', '#FFD700'],
            combo: ['#667EEA', '#764BA2', '#F093FB', '#FF6B6B'],
            perfect: ['#00FF00', '#32CD32', '#7FFF00', '#ADFF2F'],
            trail: ['#667EEA', '#764BA2', '#F093FB'],
            sparkle: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1'],
            smoke: ['#666666', '#888888', '#AAAAAA', '#CCCCCC']
        };
    }
    
    /**
     * Create particle explosion effect
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Particle color
     * @param {number} count - Number of particles
     */
    createExplosion(x, y, color = null, count = 30) {
        const colors = color ? [color] : this.colors.explosion;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 4;
            const particleColor = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                type: this.types.EXPLOSION,
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 4,
                color: particleColor,
                alpha: 1,
                life: 1,
                decay: 0.015 + Math.random() * 0.01,
                gravity: 0.1
            });
        }
    }
    
    /**
     * Create combo effect with upward floating particles
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} comboLevel - Current combo level
     */
    createComboEffect(x, y, comboLevel) {
        const count = Math.min(10 + comboLevel * 2, 30);
        const colors = this.colors.combo;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 1 + Math.random() * 2;
            const particleColor = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                type: this.types.COMBO,
                x: x + Math.random() * 20 - 10,
                y: y + Math.random() * 20 - 10,
                vx: Math.cos(angle) * speed,
                vy: -Math.abs(Math.sin(angle) * speed) - 2,
                size: 2 + Math.random() * 3,
                color: particleColor,
                alpha: 1,
                life: 1,
                decay: 0.008 + Math.random() * 0.005,
                gravity: -0.05
            });
        }
    }
    
    /**
     * Create perfect placement effect
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    createPerfectEffect(x, y) {
        // Create star burst effect
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 3 + Math.random() * 2;
            
            this.particles.push({
                type: this.types.PERFECT,
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 2,
                color: this.colors.perfect[Math.floor(Math.random() * this.colors.perfect.length)],
                alpha: 1,
                life: 1,
                decay: 0.02,
                gravity: 0
            });
        }
        
        // Add sparkle effect
        this.createSparkleEffect(x, y, 15);
    }
    
    /**
     * Create trail effect for moving blocks
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Block width
     * @param {number} height - Block height
     */
    createTrailEffect(x, y, width, height) {
        if (this.particles.length > this.maxParticles * 0.8) return;
        
        const particleCount = 3;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                type: this.types.TRAIL,
                x: x + Math.random() * width,
                y: y + Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: Math.random() * 0.5,
                size: 1 + Math.random() * 2,
                color: this.colors.trail[Math.floor(Math.random() * this.colors.trail.length)],
                alpha: 0.6,
                life: 1,
                decay: 0.03,
                gravity: 0
            });
        }
    }
    
    /**
     * Create sparkle effect
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} count - Number of sparkles
     */
    createSparkleEffect(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                type: this.types.SPARKLE,
                x: x + Math.random() * 40 - 20,
                y: y + Math.random() * 40 - 20,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                size: 1 + Math.random() * 2,
                color: this.colors.sparkle[Math.floor(Math.random() * this.colors.sparkle.length)],
                alpha: 1,
                life: 1,
                decay: 0.015,
                gravity: 0,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }
    
    /**
     * Create floating text effect
     * @param {string} text - Text to display
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} color - Text color
     */
    createFloatingText(text, x, y, color) {
        this.particles.push({
            type: this.types.FLOATING_TEXT,
            text: text,
            x: x,
            y: y,
            vx: 0,
            vy: -2,
            size: 20,
            color: color,
            alpha: 1,
            life: 1,
            decay: 0.01,
            gravity: 0
        });
    }
    
    /**
     * Create mega explosion effect
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} count - Number of particles
     */
    createMegaExplosion(x, y, count = 100) {
        const colors = ['#FF0000', '#FFD700', '#00FF00', '#00FFFF', '#FF00FF', '#FFFF00'];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 3 + Math.random() * 6;
            const particleColor = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                type: this.types.MEGA_EXPLOSION,
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 6,
                color: particleColor,
                alpha: 1,
                life: 1,
                decay: 0.008,
                gravity: 0.1,
                trail: true
            });
        }
    }
    
    /**
     * Create rainbow burst effect
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    createRainbowBurst(x, y) {
        const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        
        for (let i = 0; i < rainbowColors.length; i++) {
            const angle = (Math.PI * 2 * i) / rainbowColors.length;
            const speed = 2 + Math.random() * 3;
            
            this.particles.push({
                type: this.types.RAINBOW_BURST,
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 4,
                color: rainbowColors[i],
                alpha: 1,
                life: 1,
                decay: 0.01,
                gravity: -0.05,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }
    
    /**
     * Update all particles
     */
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply gravity
            if (particle.gravity !== 0) {
                particle.vy += particle.gravity;
            }
            
            // Apply expansion
            if (particle.expand) {
                particle.size += particle.expand;
            }
            
            // Update life and alpha
            particle.life -= particle.decay;
            particle.alpha = particle.life;
            
            // Twinkle effect for sparkles
            if (particle.twinkle !== undefined) {
                particle.twinkle += 0.1;
                particle.alpha = particle.life * (0.5 + Math.sin(particle.twinkle) * 0.5);
            }
            
            // Remove dead particles
            if (particle.life <= 0 || particle.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Limit particle count for performance
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }
    }
    
    /**
     * Render all particles
     */
    render() {
        this.ctx.save();
        
        for (const particle of this.particles) {
            this.ctx.globalAlpha = particle.alpha;
            
            switch (particle.type) {
                case this.types.FLOATING_TEXT:
                    this.renderFloatingText(particle);
                    break;
                case this.types.MEGA_EXPLOSION:
                    this.renderMegaParticle(particle);
                    break;
                case this.types.RAINBOW_BURST:
                    this.renderRainbowParticle(particle);
                    break;
                default:
                    this.renderRegularParticle(particle);
                    break;
            }
        }
        
        this.ctx.restore();
    }
    
    /**
     * Render floating text particle
     */
    renderFloatingText(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.font = `bold ${particle.size}px Orbitron`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(particle.text, particle.x, particle.y);
        this.ctx.fillText(particle.text, particle.x, particle.y);
    }
    
    /**
     * Render mega explosion particle
     */
    renderMegaParticle(particle) {
        if (particle.trail) {
            // Create trail effect
                    const gradient = this.ctx.createRadialGradient(
                        particle.x, particle.y, 0,
                        particle.x, particle.y, particle.size
                    );
                    gradient.addColorStop(0, particle.color);
                    gradient.addColorStop(1, 'transparent');
                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
        } else {
            this.renderRegularParticle(particle);
        }
    }
    
    /**
     * Render rainbow particle
     */
    renderRainbowParticle(particle) {
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color);
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    /**
     * Render regular particle
     */
    renderRegularParticle(particle) {
        this.ctx.fillStyle = particle.color;
        
        if (particle.type === this.types.SPARKLE) {
            // Render sparkles as stars
            this.drawStar(particle.x, particle.y, particle.size, 4);
        } else if (particle.type === this.types.SMOKE) {
            // Render smoke as circles with gradient
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Render regular particles as circles
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    /**
     * Draw a star shape
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Star size
     * @param {number} points - Number of points
     */
    drawStar(x, y, size, points) {
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (Math.PI * i) / points;
            const radius = i % 2 === 0 ? size : size / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }
    
    /**
     * Get particle count
     * @returns {number}
     */
    getParticleCount() {
        return this.particles.length;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}
