<template>
  <div class="container">
    <div class="scroll-section">
      <svg ref="svg" width="100%" height="100%">
        <!-- D3將在這裡渲染圓形 -->
      </svg>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  data() {
    return {
      angle: 0, // 小圓的當前角度
      lastScrollY: 0, // 上次滾動位置
      autoRotationSpeed: 0.01, // 自動旋轉速度
      animationFrameId: null, // 用於存儲動畫幀ID
    };
  },
  mounted() {
    // 設置SVG和圓形
    this.setupSvg();
    
    // 監聽滾動事件
    window.addEventListener('scroll', this.handleScroll);
    
    // 啟動自動旋轉動畫
    this.startAutoRotation();
  },
  beforeUnmount() {
    // 移除滾動事件監聽器
    window.removeEventListener('scroll', this.handleScroll);
    
    // 取消動畫
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  methods: {
    setupSvg() {
      const svg = d3.select(this.$refs.svg);
      const width = this.$refs.svg.clientWidth;
      const height = this.$refs.svg.clientHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.4; // 大圓半徑
      const smallRadius = radius * 0.1; // 小圓半徑
      
      // 繪製大圓
      this.bigCircle = svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
      
      // 繪製小圓
      this.smallCircle = svg.append('circle')
        .attr('cx', centerX + radius)
        .attr('cy', centerY)
        .attr('r', smallRadius)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
      
      // 保存參考值以便後續使用
      this.centerX = centerX;
      this.centerY = centerY;
      this.radius = radius;
    },
    handleScroll() {
      // 計算滾動方向和速度
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - this.lastScrollY;
      this.lastScrollY = currentScrollY;
      
      // 檢查SVG是否在可視區域內
      const rect = this.$refs.svg.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        return; // SVG不在可視區域內，不更新
      }
      
      // 根據滾動方向和速度更新角度
      // 滾動向下時，角度增加；滾動向上時，角度減少
      this.angle += scrollDiff * 0.01; // 調整係數控制速度
      
      // 更新小圓位置
      this.updateSmallCirclePosition();
    },
    updateSmallCirclePosition() {
      // 計算小圓在大圓邊緣的新位置
      const x = this.centerX + this.radius * Math.cos(this.angle);
      const y = this.centerY + this.radius * Math.sin(this.angle);
      
      // 更新小圓位置
      this.smallCircle
        .attr('cx', x)
        .attr('cy', y);
    },
    startAutoRotation() {
      // 創建動畫循環
      const animate = () => {
        // 檢查SVG是否在可視區域內
        if (this.$refs.svg) {
          const rect = this.$refs.svg.getBoundingClientRect();
          if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            // SVG在可視區域內，更新角度
            this.angle += this.autoRotationSpeed;
            this.updateSmallCirclePosition();
          }
        }
        
        // 繼續動畫循環
        this.animationFrameId = requestAnimationFrame(animate);
      };
      
      // 啟動動畫
      this.animationFrameId = requestAnimationFrame(animate);
    }
  }
};
</script>

<style scoped>
.container {
  height: 500vh; /* 5倍視窗高度 */
  position: relative;
}

.scroll-section {
  height: 200vh; /* 2倍視窗高度的D3區域 */
  /* 移除了sticky定位，讓元素隨著頁面正常滾動 */
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  width: 100%;
  height: 100vh; /* 視窗高度 */
}
</style>

