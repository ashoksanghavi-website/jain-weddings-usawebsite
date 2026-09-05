import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A stacked, draggable photo carousel (adapted from a 21st.dev design to this
 * site's palette and photographs). framer-motion drives the drag, so it uses
 * the library's own well-tested pointer handling — reliable on iOS/touch — and
 * the images are served locally. Drag to spin the stack, tap the centre photo
 * to open it full size.
 */

export interface CarouselPhoto {
  src: string;
  caption: string;
}

interface Config {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

function getConfig(width: number): Config {
  if (width < 640)
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 92,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  if (width < 1024)
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 135,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 175,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
}

export function PhotoCarousel({
  photos,
  onOpen,
  label = "Photographs",
}: {
  photos: CarouselPhoto[];
  onOpen?: (index: number) => void;
  label?: string;
}) {
  const progress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const activeRef = React.useRef(0);
  const [width, setWidth] = React.useState(1200);
  const [active, setActive] = React.useState(0);
  const total = photos.length;

  React.useEffect(() => {
    setWidth(window.innerWidth);
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    const unsub = progress.on("change", (p) => {
      const i = ((Math.round(p) % total) + total) % total;
      activeRef.current = i;
      setActive(i);
    });
    return () => {
      window.removeEventListener("resize", onResize);
      unsub();
    };
  }, [progress, total]);

  const config = React.useMemo(() => getConfig(width), [width]);

  const onDragStart = () => {
    startProgress.current = progress.get();
  };

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const distanceShift = -info.offset.x / config.distanceDivisor;
    const velocityShift = -info.velocity.x / config.velocityDivisor;
    let shift = Math.round(distanceShift + velocityShift);
    shift = Math.max(-3, Math.min(3, shift));
    const target = Math.round(startProgress.current) + shift;
    animate(progress, target, { type: "spring", stiffness: 200, damping: 30, mass: 1 });
  };

  const nudge = (dir: -1 | 1) => {
    animate(progress, Math.round(progress.get()) + dir, {
      type: "spring",
      stiffness: 200,
      damping: 30,
    });
  };

  return (
    <div
      className="relative w-full select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative mx-auto flex h-72 w-full max-w-5xl items-center justify-center overflow-hidden sm:h-96 lg:h-[30rem]">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={onDragStart}
          onDrag={(_, info) => progress.set(progress.get() - info.delta.x / config.sensitivity)}
          onDragEnd={onDragEnd}
          onClick={() => onOpen?.(activeRef.current)}
          className="absolute inset-0 z-50 cursor-grab touch-pan-y active:cursor-grabbing"
        />

        {photos.map((photo, i) => (
          <CarouselCard
            key={`${photo.src}-${i}`}
            photo={photo}
            index={i}
            total={total}
            progress={progress}
            config={config}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous photograph"
        onClick={() => nudge(-1)}
        className="jw-cf-arrow left-2 sm:left-6"
      >
        <span aria-hidden className="text-lg leading-none">
          ‹
        </span>
      </button>
      <button
        type="button"
        aria-label="Next photograph"
        onClick={() => nudge(1)}
        className="jw-cf-arrow right-2 sm:right-6"
      >
        <span aria-hidden className="text-lg leading-none">
          ›
        </span>
      </button>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        {photos.map((photo, i) => (
          <button
            key={`dot-${photo.src}-${i}`}
            type="button"
            aria-label={`Go to photograph ${i + 1}`}
            aria-current={i === active}
            onClick={() =>
              animate(progress, Math.round(progress.get()) + shortestDelta(active, i, total), {
                type: "spring",
                stiffness: 200,
                damping: 30,
              })
            }
            className="jw-cf-dot"
            data-active={i === active}
          />
        ))}
      </div>
    </div>
  );
}

function shortestDelta(from: number, to: number, total: number) {
  let d = (to - from) % total;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

function CarouselCard({
  photo,
  index,
  total,
  progress,
  config,
}: {
  photo: CarouselPhoto;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: Config;
}) {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => (Math.abs(o) < 0.05 ? 0 : o * config.rotationMultiplier));
  const y = useTransform(offset, (o) => (Math.abs(o) < 0.05 ? 0 : Math.abs(o) * config.yMultiplier));
  const scale = useTransform(offset, (o) => 1 - Math.abs(o) * config.scaleReduction);
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) => Math.round(100 - Math.abs(o) * 10));
  const dim = useTransform(offset, [-2, -0.5, 0, 0.5, 2], [0.55, 0.22, 0, 0.22, 0.55]);
  const capOpacity = useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, y, scale, opacity, zIndex }}
      className={cn(
        "pointer-events-none absolute overflow-hidden rounded-xl bg-card shadow-[0_22px_50px_rgba(74,13,23,0.35)]",
        "h-56 w-44 border-[5px] border-card sm:h-80 sm:w-60 lg:h-[26rem] lg:w-[19rem]",
      )}
    >
      <img
        src={photo.src}
        alt={photo.caption}
        draggable={false}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-maroon2" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <motion.p
        style={{ opacity: capOpacity }}
        className="absolute inset-x-4 bottom-5 text-center font-display text-[17px] italic leading-tight text-paper drop-shadow sm:text-[20px]"
      >
        {photo.caption}
      </motion.p>
    </motion.div>
  );
}

export default PhotoCarousel;
