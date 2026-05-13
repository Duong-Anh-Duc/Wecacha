"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Coffee, MapPin, Sparkles, Gift, Package, Flame } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const products = [
  {
    id: 1,
    name: "Arabica Thung Lũng Sương",
    price: "285.000 đ",
    weight: "250G",
    image: "/sp1.jpeg",
    tags: ["Mận chín", "Mật ong rừng", "Khói bếp"],
    desc: "Hạt rang nguyên chất từ nương cao Sơn La. Thu hoạch thủ công ở độ cao 1.500m.",
    features: [
      { icon: Coffee, text: "100% Arabica" },
      { icon: Flame, text: "Rang mộc" },
      { icon: MapPin, text: "Nông trại SL" }
    ],
    href: "/products/arabica-thung-lung-suong"
  },
  {
    id: 2,
    name: "Phin Núi Rừng",
    price: "195.000 đ",
    weight: "250G",
    image: "/sp2.jpeg",
    tags: ["Cacao", "Đường nâu", "Thảo mộc"],
    desc: "Đậm, ấm, hợp sữa đặc hoặc uống đen đá. Hương khói bếp len qua cao nguyên lạnh.",
    features: [
      { icon: Coffee, text: "100% Robusta" },
      { icon: Flame, text: "Rang mộc" },
      { icon: Sparkles, text: "Đậm đà" }
    ],
    href: "/products/phin-nui-rung"
  },
  {
    id: 3,
    name: "Hộp Quà Thổ Cẩm",
    price: "620.000 đ",
    weight: "2 X 250G",
    image: "/sp3.jpeg",
    tags: ["Mận", "Cacao", "Mật ong"],
    desc: "Bộ quà cà phê và khăn thổ cẩm thủ công. Món quà ý nghĩa từ đại ngàn gửi trao.",
    features: [
      { icon: Sparkles, text: "Thủ công" },
      { icon: Gift, text: "Ý nghĩa" },
      { icon: Package, text: "Cao cấp" }
    ],
    href: "/products/hop-qua-tho-cam"
  }
];

export function CinematicProducts() {
  return (
    <section className="relative bg-[#030604] py-32 lg:py-48 overflow-hidden">
      {/* Massive Background Typography */}
      <div className="absolute top-32 left-0 w-full overflow-hidden pointer-events-none select-none flex justify-center opacity-[0.015]">
        <h2 className="text-[25vw] font-serif font-black text-white whitespace-nowrap leading-none tracking-tighter mix-blend-overlay">
          MASTERPIECE
        </h2>
      </div>

      {/* Deep Atmospheric Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#112414] via-[#030604] to-[#000000] opacity-80" />
      <div className="absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b5703a]/30 to-transparent" />
      
      {/* Cinematic Glowing Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-[#b5703a] mix-blend-screen rounded-full filter blur-[200px] opacity-[0.12] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#2a5a31] mix-blend-screen rounded-full filter blur-[150px] opacity-[0.25] pointer-events-none" />

      {/* Subtle Fog/Smoke Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)', filter: 'blur(40px)' }} />

      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* Sticky Storytelling Left Column */}
        <div className="lg:w-[35%] lg:sticky lg:top-40 pt-10 z-30">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#b5703a]/30 bg-[#b5703a]/10 text-[#b5703a] text-xs font-bold uppercase tracking-[0.25em] mb-10 shadow-[0_0_30px_rgba(181,112,58,0.15)] backdrop-blur-md">
              <Flame className="w-4 h-4" /> Phiên bản giới hạn
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h2 className="font-serif text-[3.5rem] sm:text-7xl lg:text-[5rem] xl:text-[5.5rem] text-[#f4f2ea] leading-[1.05] mb-10 drop-shadow-2xl">
              Đánh thức <br/>
              <span className="italic text-white/40 font-light">giác quan</span> <br/>
              nguyên thủy.
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-white/60 text-lg sm:text-xl leading-[1.8] mb-14 border-l-[3px] border-[#b5703a]/60 pl-8 font-light max-w-lg">
              Mỗi hạt cà phê là một thước phim điện ảnh về Tây Bắc. Thu hoạch thủ công từ những đỉnh sương mù 1.500m, rang mộc trên lửa nhỏ để giữ trọn linh hồn của đại ngàn.
            </p>
          </Reveal>
          
          <Reveal delay={0.3}>
            <div className="flex gap-16">
              <div className="group cursor-default">
                <div className="text-4xl sm:text-5xl font-serif text-[#b5703a] mb-2 transition-transform duration-500 group-hover:-translate-y-1 drop-shadow-[0_0_15px_rgba(181,112,58,0.3)]">1.500m</div>
                <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Độ cao nông trại</div>
              </div>
              <div className="group cursor-default">
                <div className="text-4xl sm:text-5xl font-serif text-[#b5703a] mb-2 transition-transform duration-500 group-hover:-translate-y-1 drop-shadow-[0_0_15px_rgba(181,112,58,0.3)]">05</div>
                <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold flex items-center gap-2">Mẻ rang/tuần <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b5703a] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#b5703a]"></span></span></div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Staggered Cards Right Column */}
        <div className="lg:w-[65%] flex flex-col sm:flex-row gap-8 lg:gap-12 justify-center relative z-20">
          
          {/* Column 1 (Staggered Up) */}
          <div className="flex flex-col gap-8 lg:gap-12 w-full sm:w-1/2">
            {[products[0], products[2]].map((product, idx) => (
              <Reveal key={product.id} delay={0.4 + idx * 0.2}>
                <div className="group relative w-full h-[750px] rounded-[2.5rem] overflow-hidden border border-[#b5703a]/20 bg-[#081009] shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-all duration-700 hover:shadow-[0_40px_100px_rgba(181,112,58,0.25)] hover:-translate-y-3">
                  
                  {/* Cinematic Image Background */}
                  <div className="absolute top-0 left-0 w-full h-[65%] overflow-hidden bg-[#111]">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-[1.15] opacity-90 group-hover:opacity-100"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    {/* Smoky Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081009] via-[#081009]/50 to-transparent" />
                  </div>

                  {/* Ambient Amber Flare */}
                  <div className="absolute -right-20 top-10 w-64 h-64 bg-[#b5703a] rounded-full mix-blend-screen filter blur-[100px] opacity-20 group-hover:opacity-50 transition-opacity duration-1000 pointer-events-none" />

                  {/* Film Grain Texture */}
                  <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

                  {/* Top Badges */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold tracking-widest shadow-xl">
                      <Coffee className="w-3.5 h-3.5 text-[#b5703a]" /> {product.weight}
                    </div>
                    <button className="flex items-center justify-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-[#b5703a] hover:bg-black/60 transition-all shadow-xl group/btn">
                      <Heart className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col justify-end h-full">
                    
                    {/* Floating Tags */}
                    <div className="flex flex-wrap gap-2.5 mb-5">
                      {product.tags.map((tag, tagIdx) => (
                        <span key={tagIdx} className="px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[#f4f2ea]/80 text-[10px] font-bold tracking-widest uppercase shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title & Price */}
                    <div className="flex justify-between items-end gap-4 mb-4">
                      <h3 className="font-serif text-[2.2rem] xl:text-[2.5rem] text-[#f4f2ea] leading-[1.1] drop-shadow-xl group-hover:text-[#b5703a] transition-colors duration-500">
                        {product.name}
                      </h3>
                      <span className="text-[#b5703a] font-bold text-2xl whitespace-nowrap drop-shadow-[0_0_15px_rgba(181,112,58,0.4)]">
                        {product.price}
                      </span>
                    </div>

                    {/* Storytelling Snippet */}
                    <p className="text-white/60 text-[14px] leading-[1.7] mb-7 font-light">
                      {product.desc}
                    </p>

                    {/* Glassmorphism Specs Panel */}
                    <div className="grid grid-cols-3 gap-2 p-4 mb-7 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-inner">
                      {product.features.map((feat, featIdx) => {
                        const Icon = feat.icon;
                        return (
                          <div key={featIdx} className="flex flex-col items-center justify-center gap-2 text-center px-1">
                            <Icon className="w-4 h-4 text-[#b5703a]" strokeWidth={1.5} />
                            <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{feat.text}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Irresistible Buttons */}
                    <div className="flex gap-4 mb-6">
                      <button className="flex-[0.8] flex items-center justify-center gap-2 bg-[#f4f2ea] text-[#142918] py-4 rounded-2xl font-bold text-sm transition-all hover:bg-white hover:scale-[1.02] shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                        <ShoppingBag className="w-4 h-4" /> Thêm giỏ
                      </button>
                      <button className="flex-[1.2] flex items-center justify-center gap-2 bg-gradient-to-r from-[#b5703a] via-[#c6824b] to-[#b5703a] text-white py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(181,112,58,0.5)] shadow-[0_10px_20px_rgba(181,112,58,0.3)] bg-[length:200%_auto] hover:bg-right">
                        <Package className="w-4 h-4" /> Mua ngay
                      </button>
                    </div>

                    {/* Immersive Bottom Link */}
                    <div className="pt-5 border-t border-white/10 flex justify-between items-center group/link cursor-pointer">
                      <span className="text-[#b5703a] text-[12px] font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Khám phá ngay {product.name.split(' ')[0]}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#b5703a] transition-transform duration-300 group-hover/link:translate-x-2" />
                    </div>

                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Column 2 (Staggered Down) */}
          <div className="flex flex-col gap-8 lg:gap-12 w-full sm:w-1/2 sm:mt-40">
            {[products[1]].map((product, idx) => (
              <Reveal key={product.id} delay={0.5}>
                <div className="group relative w-full h-[750px] rounded-[2.5rem] overflow-hidden border border-[#b5703a]/20 bg-[#081009] shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-all duration-700 hover:shadow-[0_40px_100px_rgba(181,112,58,0.25)] hover:-translate-y-3">
                  
                  {/* Cinematic Image Background */}
                  <div className="absolute top-0 left-0 w-full h-[65%] overflow-hidden bg-[#111]">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-[1.15] opacity-90 group-hover:opacity-100"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081009] via-[#081009]/50 to-transparent" />
                  </div>

                  {/* Ambient Amber Flare */}
                  <div className="absolute -right-20 top-10 w-64 h-64 bg-[#b5703a] rounded-full mix-blend-screen filter blur-[100px] opacity-20 group-hover:opacity-50 transition-opacity duration-1000 pointer-events-none" />

                  {/* Film Grain Texture */}
                  <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

                  {/* Top Badges */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold tracking-widest shadow-xl">
                      <Coffee className="w-3.5 h-3.5 text-[#b5703a]" /> {product.weight}
                    </div>
                    <button className="flex items-center justify-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-[#b5703a] hover:bg-black/60 transition-all shadow-xl group/btn">
                      <Heart className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col justify-end h-full">
                    
                    {/* Floating Tags */}
                    <div className="flex flex-wrap gap-2.5 mb-5">
                      {product.tags.map((tag, tagIdx) => (
                        <span key={tagIdx} className="px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[#f4f2ea]/80 text-[10px] font-bold tracking-widest uppercase shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title & Price */}
                    <div className="flex justify-between items-end gap-4 mb-4">
                      <h3 className="font-serif text-[2.2rem] xl:text-[2.5rem] text-[#f4f2ea] leading-[1.1] drop-shadow-xl group-hover:text-[#b5703a] transition-colors duration-500">
                        {product.name}
                      </h3>
                      <span className="text-[#b5703a] font-bold text-2xl whitespace-nowrap drop-shadow-[0_0_15px_rgba(181,112,58,0.4)]">
                        {product.price}
                      </span>
                    </div>

                    {/* Storytelling Snippet */}
                    <p className="text-white/60 text-[14px] leading-[1.7] mb-7 font-light">
                      {product.desc}
                    </p>

                    {/* Glassmorphism Specs Panel */}
                    <div className="grid grid-cols-3 gap-2 p-4 mb-7 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-inner">
                      {product.features.map((feat, featIdx) => {
                        const Icon = feat.icon;
                        return (
                          <div key={featIdx} className="flex flex-col items-center justify-center gap-2 text-center px-1">
                            <Icon className="w-4 h-4 text-[#b5703a]" strokeWidth={1.5} />
                            <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{feat.text}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Irresistible Buttons */}
                    <div className="flex gap-4 mb-6">
                      <button className="flex-[0.8] flex items-center justify-center gap-2 bg-[#f4f2ea] text-[#142918] py-4 rounded-2xl font-bold text-sm transition-all hover:bg-white hover:scale-[1.02] shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                        <ShoppingBag className="w-4 h-4" /> Thêm giỏ
                      </button>
                      <button className="flex-[1.2] flex items-center justify-center gap-2 bg-gradient-to-r from-[#b5703a] via-[#c6824b] to-[#b5703a] text-white py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(181,112,58,0.5)] shadow-[0_10px_20px_rgba(181,112,58,0.3)] bg-[length:200%_auto] hover:bg-right">
                        <Package className="w-4 h-4" /> Mua ngay
                      </button>
                    </div>

                    {/* Immersive Bottom Link */}
                    <div className="pt-5 border-t border-white/10 flex justify-between items-center group/link cursor-pointer">
                      <span className="text-[#b5703a] text-[12px] font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Khám phá ngay {product.name.split(' ')[0]}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#b5703a] transition-transform duration-300 group-hover/link:translate-x-2" />
                    </div>

                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
