import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, {
  NodeObject,
  ForceGraphMethods,
  GraphData,
  LinkObject
} from "react-force-graph-2d";
import * as d3 from "d3-force";
import {
  NODE_PADDING,
  NODE_BORDER_WIDTH,
  LINK_COLOR,
  NODE_FILL_COLOR,
  STROKE_COLOR
} from "./misc/map-constants";
import { FollowPopover } from "@components/FollowPopover";
import {
  calculatePLCircleCentersAndRadii,
  getProximityLevels,
  PLConfig
} from "./misc/pl-generator";
import {
  generateGraphData,
  cloneGraphData,
  getParticleColor
} from "./misc/map-utils";
import { MapLink, MapNode } from "./node.model";
import { MapData } from "@api/models/map.model";
import { AutInteractionsDialog } from "@components/AutInteractionsDialog";
import {
  IsInteractionDialogOpen,
  setOpenInteractions
} from "@store/ui-reducer";
import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import MapInteractions from "./MapInteractions";

function InteractionMap({
  parentRef: containerRef,
  isActive,
  mapData
}: {
  parentRef: any;
  isActive: boolean;
  mapData: MapData;
}) {
  const fgRef = useRef<ForceGraphMethods>(null);
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });
  const [centralNode, setCentralNode] = useState<NodeObject<MapNode>>(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [highlightedPl, setHighlightedPl] = useState(null);
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [linkStats, setLinkStats] = useState<{
    x: number;
    y: number;
    data: any;
  } | null>(null);
  const [pLevels, setProximityLevels] = useState<PLConfig[]>([]);
  const [initialGraphData, setInitialGraphData] = useState<
    GraphData<MapNode, LinkObject<MapNode, MapLink>>
  >({
    nodes: [],
    links: []
  });
  const [graphData, setGraphData] = useState<
    GraphData<MapNode, LinkObject<MapNode, MapLink>>
  >({
    nodes: [],
    links: []
  });

  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useAppDispatch();
  const isInteractionDialogOpen = useSelector(IsInteractionDialogOpen);
  const showPopoverTimeoutRef = useRef(null);
  const hidePopoverTimeoutRef = useRef(null);
  const showLinkPopoverTimeoutRef = useRef<number | null>(null);
  const hideLinkPopoverTimeoutRef = useRef<number | null>(null);

  const handleClose = () => {
    dispatch(setOpenInteractions(false));
  };

  const openInteractionsModal = () => {
    dispatch(setOpenInteractions(true));
  };

  const onRenderFramePre = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const circleData = calculatePLCircleCentersAndRadii(graphData.nodes);
      Object.values(circleData).forEach((circle: any) => {
        ctx.beginPath();
        ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
        ctx.strokeStyle =
          circle?.pl === highlightedPl
            ? "rgba(54, 191, 250, 1)"
            : "rgba(54, 191, 250, 0.3)";
        ctx.lineWidth = circle?.pl === highlightedPl ? 1 : 0.5;
        ctx.stroke();
      });
    },
    [highlightedPl, graphData.nodes]
  );

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    }
    if (containerRef.current) {
      updateSize();
    }
  }, [containerRef]);

  const graphDataAndPL = useMemo(() => {
    const { proximityLevels, centralAutId } = getProximityLevels(mapData);
    const { graphData: _graphData, centralNode: _centralNode } =
      generateGraphData(centralAutId, proximityLevels);

    return {
      graphData: _graphData,
      proximityLevels,
      centralNode: _centralNode
    };
  }, [mapData]);

  useEffect(() => {
    if (!graphDataAndPL) return;
    setInitialGraphData(graphDataAndPL.graphData);
    setGraphData(cloneGraphData(graphDataAndPL.graphData));
    setProximityLevels(graphDataAndPL.proximityLevels);
    setCentralNode(graphDataAndPL.centralNode);
  }, [graphDataAndPL]);

  const handleNodeHover = useCallback(
    (node: NodeObject<MapNode>) => {
      if (isDragging || !isActive) return;
      if (!node) {
        clearTimeout(showPopoverTimeoutRef.current);
        hidePopoverTimeoutRef.current = setTimeout(
          () => setShowPopover(false),
          100
        );
      } else {
        clearTimeout(hidePopoverTimeoutRef.current);
        showPopoverTimeoutRef.current = setTimeout(() => {
          setHoveredNode(node);
          setShowPopover(true);
        }, 50);
      }
      if (!node) return;
      setHoveredNode(node);
      const bbox = fgRef.current.getGraphBbox((n) => n.id === node.id);

      const graphCenter = {
        x: (bbox.x[0] + bbox.x[1]) / 2,
        y: (bbox.y[0] + bbox.y[1]) / 2
      };

      const centerScreen = fgRef.current.graph2ScreenCoords(
        graphCenter.x,
        graphCenter.y
      );

      const containerRect = containerRef.current.getBoundingClientRect();

      const popoverX = centerScreen.x + containerRect.left;
      const popoverY = centerScreen.y + containerRect.top;

      setAnchorPos({ x: popoverX, y: popoverY + node.size });
    },
    [fgRef, containerRef, isDragging, isActive]
  );

  const handleNodeDrag = useCallback(() => {
    setIsDragging(true);
    setShowPopover(false);
  }, []);

  const handleNodeDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.d3Force(
      "collision",
      d3.forceCollide((node) => Math.sqrt(100 / (node.level + 1)))
    );
  }, [fgRef]);

  // Handle link popover close
  const handleLinkPopoverClose = () => {
    clearTimeout(hideLinkPopoverTimeoutRef.current as number);
    clearTimeout(showLinkPopoverTimeoutRef.current as number);
    setShowLinkPopover(false);
  };

  // Cancel link popover close
  const cancelLinkPopoverClose = () => {
    clearTimeout(hideLinkPopoverTimeoutRef.current as number);
  };

  useEffect(() => {
    if (isDragging || !isActive) {
      clearTimeout(hidePopoverTimeoutRef.current as number);
      clearTimeout(showPopoverTimeoutRef.current as number);
      setShowPopover(false);
      clearTimeout(hideLinkPopoverTimeoutRef.current as number);
      clearTimeout(showLinkPopoverTimeoutRef.current as number);
      setShowLinkPopover(false);
    }
  }, [isDragging, isActive]);

  const drawNode = useCallback(
    (node: NodeObject<MapNode>, ctx: CanvasRenderingContext2D) => {
      const size = node.size;
      const nodeOuterSize = size + NODE_PADDING * 2 + NODE_BORDER_WIDTH * 2;

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeOuterSize / 2, 0, Math.PI * 2, false);
      ctx.fillStyle = NODE_FILL_COLOR; // Use the lighter color for the fill
      ctx.fill();

      // Draw the circular image
      if (node.img && node.img.complete && node.img.naturalWidth !== 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          node.img,
          node.x - size / 2,
          node.y - size / 2,
          size,
          size
        );

        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeOuterSize / 2, 0, Math.PI * 2, false);
      ctx.lineWidth = NODE_BORDER_WIDTH;
      ctx.strokeStyle = STROKE_COLOR;
      ctx.stroke();
    },
    []
  );

  const handleLinkHover = useCallback(
    (link, prevLink) => {
      if (isDragging || !isActive) return;
      if (!link) {
        clearTimeout(showLinkPopoverTimeoutRef.current as number);
        hideLinkPopoverTimeoutRef.current = window.setTimeout(
          () => setShowLinkPopover(false),
          100
        );
      } else {
        clearTimeout(hideLinkPopoverTimeoutRef.current as number);
        showLinkPopoverTimeoutRef.current = window.setTimeout(() => {
          setHoveredLink(link);
          setShowLinkPopover(true);
        }, 50);
      }
      if (!link) return;
      const bbox = fgRef.current?.getGraphBbox(
        (n) => n.id === link.source.id || n.id === link.target.id
      );
      const graphCenter = {
        x: (bbox.x[0] + bbox.x[1]) / 2,
        y: (bbox.y[0] + bbox.y[1]) / 2
      };
      const centerScreen = fgRef.current?.graph2ScreenCoords(
        graphCenter.x,
        graphCenter.y
      );
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (centerScreen && containerRect) {
        const stats = {
          x: centerScreen.x + containerRect.left,
          y: centerScreen.y + containerRect.top,
          data: {
            link,
            centralNode
          }
        };
        setLinkStats(stats);
      }
    },
    [fgRef, containerRef, isDragging, isActive]
  );

  const handlePopoverClose = () => {
    clearTimeout(hidePopoverTimeoutRef.current);
    clearTimeout(showPopoverTimeoutRef.current);
    setShowPopover(false);
  };

  const cancelPopoverClose = () => {
    clearTimeout(hidePopoverTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(showPopoverTimeoutRef.current as number);
      clearTimeout(hidePopoverTimeoutRef.current as number);
      clearTimeout(showLinkPopoverTimeoutRef.current as number);
      clearTimeout(hideLinkPopoverTimeoutRef.current as number);
    };
  }, []);

  return (
    <>
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        onRenderFramePre={onRenderFramePre}
        onEngineStop={() => {
          if (mapData?.members?.length > 2 && fgRef.current) {
            fgRef.current.zoomToFit(300);
          }
        }}
        nodeVal={(node: NodeObject<MapNode>) =>
          node.size + NODE_BORDER_WIDTH * 2
        }
        nodeLabel={() => null}
        linkColor={() => LINK_COLOR}
        onNodeHover={handleNodeHover}
        onNodeDrag={handleNodeDrag}
        onNodeDragEnd={() => {
          handleNodeDragEnd();
          setGraphData(cloneGraphData(initialGraphData));
        }}
        nodeCanvasObject={drawNode}
        linkWidth={(node) => node.is}
        // linkDirectionalParticleWidth={3}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={(link) => link.speed}
        linkDirectionalParticleColor={getParticleColor}
        // onLinkHover={handleLinkHover}
        linkHoverPrecision={8}
        d3VelocityDecay={1}
        cooldownTicks={0}
      // enableZoomInteraction={false}
      />
      <AutInteractionsDialog
        open={isInteractionDialogOpen}
        title="Interactions"
        onClose={handleClose}
      />
      <FollowPopover
        type="custom"
        anchorPos={anchorPos}
        data={hoveredNode}
        open={showPopover && !isDragging && isActive}
        onMouseEnter={cancelPopoverClose}
        onMouseLeave={handlePopoverClose}
      />
      {/* <LinkStatsPopover
        type="custom"
        anchorPos={{ x: linkStats?.x, y: linkStats?.y }}
        data={linkStats?.data || {}}
        open={showLinkPopover && !isDragging && isActive}
        handleClose={handleLinkPopoverClose}
        onMouseEnter={cancelLinkPopoverClose}
        onMouseLeave={handleLinkPopoverClose}
      /> */}
      <MapInteractions
        pLevels={pLevels}
        totalMembers={mapData?.members?.length}
        setHighlightedPl={setHighlightedPl}
        openInteractionsModal={openInteractionsModal}
      />
    </>
  );
}

export default memo(InteractionMap);
