// Center of Delingha City
const CENTER = { lng: 97.3700, lat: 37.3700 };

/**
 * Generate a random number within a range
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
const randomRange = (min, max) => Math.random() * (max - min) + min;

/**
 * Generate a coordinate with a random offset from the center
 * @param {number} range value around 0.005 - 0.02
 * @returns {Object} { x, y }
 */
const randomCoord = (center = CENTER, range = 0.01) => {
    return {
        x: center.lng + randomRange(-range, range),
        y: center.lat + randomRange(-range, range)
    }
};

/**
 * Generate a polygon path (closed loop)
 * @param {Object} center 
 * @param {number} size 
 * @returns {Array} Array of [x, y] arrays
 */
const generatePolygonPath = (center, size = 0.003) => {
    const { x, y } = center;
    return [
        [x - size, y - size],
        [x + size, y - size],
        [x + size, y + size],
        [x - size, y + size],
        [x - size, y - size] // Close the loop
    ];
};

/**
 * Generate a polyline path with smoother transitions
 * @param {Object} start 
 * @param {number} segments 
 * @returns {Array} Array of [x, y] arrays
 */
const generatePolylinePath = (start, segments = 12) => {
    const path = [[start.x, start.y]];
    let currentX = start.x;
    let currentY = start.y;

    for (let i = 0; i < segments; i++) {
        // Reduced range for smoother directional changes
        currentX += randomRange(-0.001, 0.001);
        currentY += randomRange(-0.001, 0.001);
        path.push([currentX, currentY]);
    }
    return path;
};

// Helper to get points from a polyline path for "Wells"
const getPointsFromPath = (path) => {
    return path.map(([x, y]) => ({ x, y }));
};

export const getUrbanData = () => {
    // (A) Landscaping (园林绿化)

    // 1. Reserves (Polygon) - 2 polygons
    const reserves = [
        {
            positions: [generatePolygonPath(randomCoord(CENTER, 0.015), 0.004)],
            name: "巴音河湿地公园",
            type: "reserve"
        },
        {
            positions: [generatePolygonPath(randomCoord(CENTER, 0.015), 0.003)],
            name: "柏树山森林公园",
            type: "reserve"
        }
    ];

    // 2. Woodlands (Point) - 10 points
    const woodlands = Array.from({ length: 10 }).map((_, i) => {
        const coord = randomCoord(CENTER, 0.02);
        return {
            x: coord.x,
            y: coord.y,
            name: `防风固沙林${String(i + 1).padStart(2, '0')}`,
            type: "woodland",
            image: 'https://via.placeholder.com/300x200?text=Woodland+' + (i + 1)
        }
    });

    // (B) Municipal Facilities (市政设施)

    // 3. Pipes (Polyline) - 3 lines
    const pipePaths = Array.from({ length: 3 }).map(() => generatePolylinePath(randomCoord(CENTER, 0.01)));
    const pipes = pipePaths.map((path, i) => ({
        positions: [path],
        name: `市政排水管网${i + 1}`,
        type: "pipe"
    }));

    // 4. Wells (Point) - 8 points derived from pipe paths
    // Flatten paths and pick 8 random points
    const allPipePoints = pipePaths.flatMap(path => getPointsFromPath(path));
    const wells = Array.from({ length: 8 }).map((_, i) => {
        const point = allPipePoints[i % allPipePoints.length] || randomCoord();
        return {
            x: point.x,
            y: point.y,
            name: `检查井${String(i + 1).padStart(2, '0')}`,
            type: "well",
            image: 'https://via.placeholder.com/300x200?text=Well+' + (i + 1)
        }
    });

    // 5. Stones (Point) - 5 points
    const stones = Array.from({ length: 5 }).map((_, i) => {
        const coord = randomCoord(CENTER, 0.008);
        return {
            x: coord.x,
            y: coord.y,
            name: `路沿石修复点${i + 1}`,
            type: "stone",
            image: 'https://via.placeholder.com/300x200?text=Stone+' + (i + 1)
        }
    });

    // 6. Bridges (Point) - 2 points
    const bridges = [
        { ...randomCoord(CENTER, 0.005), name: "巴音河1号桥", type: "bridge", image: 'https://via.placeholder.com/300x200?text=Bridge+1' },
        { ...randomCoord(CENTER, 0.005), name: "巴音河2号桥", type: "bridge", image: 'https://via.placeholder.com/300x200?text=Bridge+2' }
    ];

    // 7. Fountains (Point)
    const fountains = [
        { ...randomCoord(CENTER, 0.002), name: "奥运广场喷泉", type: "fountain", image: 'https://via.placeholder.com/300x200?text=Fountain' }
    ];

    // 8. Squares (Point)
    const squares = [
        { ...CENTER, name: "中心广场", type: "square", image: 'https://via.placeholder.com/300x200?text=Square' }
    ];

    return {
        landscaping: {
            reserves: reserves.map((r, i) => ({
                ...r,
                id: `res_${i}`,
                image: `https://picsum.photos/400/300?random=land_${i}`
            })),
            woodlands: woodlands.map((w, i) => ({
                ...w,
                id: `wood_${i}`,
                image: `https://picsum.photos/400/300?random=wood_${i}`
            }))
        },
        municipal: {
            pipes: pipes.map((p, i) => ({ ...p, id: `pipe_${i}` })),
            wells: wells.map((w, i) => ({
                ...w,
                id: `well_${i}`,
                image: `https://picsum.photos/400/300?random=well_${i}`
            })),
            stones: stones.map((s, i) => ({
                ...s,
                id: `stone_${i}`,
                image: `https://picsum.photos/400/300?random=stone_${i}`
            })),
            bridges: bridges.map((b, i) => ({
                ...b,
                id: `bridge_${i}`,
                image: `https://picsum.photos/400/300?random=bridge_${i}`
            })),
            fountains: fountains.map((f, i) => ({
                ...f,
                id: `fount_${i}`,
                image: `https://picsum.photos/400/300?random=fount_${i}`
            })),
            squares: squares.map((s, i) => ({
                ...s,
                id: `sq_${i}`,
                image: `https://picsum.photos/400/300?random=sq_${i}`
            }))
        },
        events: [
            { id: 'ev_1', ...randomCoord(CENTER, 0.008), type: 'event', name: '垃圾堆积', status: 'pending', reporter: '市民王某', time: '2024-05-20 09:30', dept: '市综合行政执法局', desc: '德令哈大桥北侧发现大量生活垃圾堆积，散发异味。' },
            { id: 'ev_2', ...randomCoord(CENTER, 0.012), type: 'event', name: '路灯不亮', status: 'processing', reporter: '市民刘某', time: '2024-05-20 10:15', dept: '市住房和城乡建设局', desc: '格尔木路中段连续三盏路灯故障，影响夜间行行车。' },
            { id: 'ev_3', ...randomCoord(CENTER, 0.005), type: 'event', name: '占道经营', status: 'completed', reporter: '市民李某', time: '2024-05-19 16:40', dept: '市综合行政执法局', desc: '中心广场南侧流动摊位占用人行道。' },
            { id: 'ev_4', ...randomCoord(CENTER, 0.015), type: 'event', name: '井盖破损', status: 'pending', reporter: '市民陈某', time: '2024-05-20 11:00', dept: '市住房和城乡建设局', desc: '滨河路绿化带旁发现井盖不严，存在安全隐患。' }
        ]
    };
};
