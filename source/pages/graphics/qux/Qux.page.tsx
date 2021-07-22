import React from 'react'
import {
  Circle,
  getMirroredPoint,
  getMirroredRotatedLoop,
  getRotatedLoopChildCircle,
  getRotatedLoopPoint,
  getRotatedLoopPoints,
  getTracePoint,
  Point,
  RotatedLoop,
} from '../../../library/circleStuff'
import { Polygon } from '../../../library/components/Polygon'
import { Sircle } from '../../../library/components/Sircle'
import {
  DiscreteRhythm,
  getElementIndices,
  getNaturalCompositeRhythm,
} from '../../../library/rhythmStuff'

export default {
  pageRoute: '/graphics/qux',
  PageContent: Qux,
  htmlTitle: 'qux - jmath',
  htmlDescription: 'a qux graphic',
  generatePdf: false,
  pdfFileName: 'qux',
}

function Qux() {
  const rootCircle: Circle = {
    radius: 50,
    center: { x: 50, y: 50 },
  }
  const rootLoop: RotatedLoop = {
    baseCircle: rootCircle,
    childCircle: {
      relativeRadius: 12 / 13,
      relativeDepth: 1,
      phaseAngle: 0,
    },
    rotationAnchor: 'base',
    rotationAngle: -Math.PI / 2,
  }
  const coreLoops = mapRhythmSequence<
    Array<{
      rotatedLoop: RotatedLoop
    }>
  >({
    baseRhythm: getNaturalCompositeRhythm({
      rhythmResolution: 11,
      rhythmParts: [
        { rhythmDensity: 7, rhythmPhase: 1 },
        { rhythmDensity: 4, rhythmPhase: 0 },
      ],
      rhythmPhase: 0,
    }),
    getCellResult: ({ rhythmResolution, rhythmIndex }) => {
      const angleA = (Math.PI / rhythmResolution) * rhythmIndex - Math.PI / 2
      const pointA = getTracePoint({
        somePoints: getRotatedLoopPoints({
          sampleCount: 256,
          someRotatedLoop: rootLoop,
        }),
        originPoint: rootCircle.center,
        traceAngle: angleA,
      })
      const pointB = getTracePoint({
        somePoints: getRotatedLoopPoints({
          sampleCount: 256,
          someRotatedLoop: rootLoop,
        }),
        originPoint: rootCircle.center,
        traceAngle: angleA + Math.PI,
      })
      return mapRhythmSequence({
        baseRhythm: getNaturalCompositeRhythm({
          rhythmResolution: 13,
          rhythmParts: [
            { rhythmDensity: 7, rhythmPhase: 1 },
            { rhythmDensity: 3, rhythmPhase: 2 },
          ],
          rhythmPhase: 0, // 3
        }),
        getCellResult: ({
          rhythmResolution,
          rhythmIndex,
          rhythmDensity,
          nestIndex,
        }) => {
          const lineAngle = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x)
          const lineLength = Math.sqrt(
            Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
          )
          // const cellRadius =
          //   lineLength - (lineLength / rhythmResolution) * rhythmIndex
          const cellRadius = (lineLength / rhythmResolution) * rhythmIndex
          const newBaseCircleCenter = {
            x: cellRadius * Math.cos(lineAngle) + pointA.x,
            y: cellRadius * Math.sin(lineAngle) + pointA.y,
          }
          const distanceFromRootCenter = Math.sqrt(
            Math.pow(newBaseCircleCenter.x - rootCircle.center.x, 2) +
              Math.pow(newBaseCircleCenter.y - rootCircle.center.y, 2)
          )
          const relativeAngleToCenter = Math.atan2(
            newBaseCircleCenter.y - rootCircle.center.y,
            newBaseCircleCenter.x - rootCircle.center.x
          )
          const openRhythmRatio =
            (rhythmResolution - rhythmDensity) / rhythmResolution
          const nestRatioStep = openRhythmRatio / rhythmDensity
          const rhythmRatioStep = openRhythmRatio / rhythmResolution
          return {
            rotatedLoop: {
              baseCircle: {
                radius: 1.25 * Math.log(distanceFromRootCenter),
                center: newBaseCircleCenter,
              },
              childCircle: {
                relativeRadius:
                  7 / 12 + rhythmRatioStep * rhythmIndex * (5 / 12),
                relativeDepth: 1 - nestRatioStep * nestIndex * (4 / 12),
                phaseAngle: relativeAngleToCenter,
              },
              rotationAnchor: 'base',
              rotationAngle:
                (relativeAngleToCenter / 2) * Math.PI * Math.PI + Math.PI / 2,
            },
          }
        },
      })
    },
  }).flat()

  const baseLoops = [
    ...coreLoops,
    ...coreLoops.map(({ rotatedLoop }) => ({
      rotatedLoop: getMirroredRotatedLoop({
        mirrorAngle: Math.PI / 2,
        originPoint: rootCircle.center,
        baseLoop: rotatedLoop,
      }),
    })),
  ]
  const loopGroups = getLoopGroups({
    someLoops: baseLoops.map(({ rotatedLoop }) => rotatedLoop),
  })
  const singularLoops = baseLoops.filter(
    ({ rotatedLoop }) =>
      loopGroups.flat().findIndex((someLoop) => someLoop === rotatedLoop) === -1
  )
  const fooLoops: Array<RotatedLoop> = [
    {
      baseCircle: {
        radius: 12,
        center: { x: 50, y: 50 },
      },
      childCircle: {
        relativeRadius: 1 / 8,
        relativeDepth: 0,
        phaseAngle: Math.PI / 2,
      },
      rotationAnchor: 'base',
      rotationAngle: Math.PI / 4,
    },
    {
      baseCircle: {
        radius: 12,
        center: { x: 50, y: 50 },
      },
      childCircle: {
        relativeRadius: 5 / 8,
        relativeDepth: 1,
        phaseAngle: Math.PI / 2,
      },
      rotationAnchor: 'base',
      rotationAngle: -Math.PI / 4,
    },
  ]
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
      }}
      viewBox={'-10 -10 120 120'}
    >
      <rect x={-10} y={-10} width={120} height={120} fill={'lightgrey'} />
      <g transform={'translate(0,5)'}>
        {/* {baseLoops.map(({ rotatedLoop }) => (
          <>
            <Sircle
              strokeColor={'white'}
              strokeWidth={1.25}
              someCircle={rotatedLoop.baseCircle}
            />
            <Polygon
              strokeColor={'white'}
              strokeWidth={1.25}
              somePoints={getRotatedLoopPoints({
                sampleCount: 256,
                someRotatedLoop: rotatedLoop,
              })}
            />
          </>
        ))} */}
        {/* {loopGroups.map((someLoopGroup) => {
          const groupColor = `rgb(${128 + 128 * Math.random()}, ${
            128 + 128 * Math.random()
          }, ${128 + 128 * Math.random()})`
          return someLoopGroup.map((someRotatedLoop) => (
            <>
              <Sircle
                strokeColor={'white'}
                strokeWidth={1.25}
                someCircle={someRotatedLoop.baseCircle}
              />
              <Polygon
                strokeColor={'white'}
                strokeWidth={1.25}
                somePoints={getRotatedLoopPoints({
                  sampleCount: 256,
                  someRotatedLoop: someRotatedLoop,
                })}
              />
              <Sircle
                strokeColor={groupColor}
                strokeWidth={1}
                someCircle={someRotatedLoop.baseCircle}
              />
              <Polygon
                strokeColor={groupColor}
                strokeWidth={1}
                somePoints={getRotatedLoopPoints({
                  sampleCount: 256,
                  someRotatedLoop: someRotatedLoop,
                })}
              />
            </>
          ))
        })} */}
        {loopGroups.map((someLoopGroup) => (
          <Polygon
            strokeColor={'black'}
            strokeWidth={0.3}
            somePoints={getCompositeLoopPoints({
              sampleCount: 256,
              baseLoops: someLoopGroup,
            })}
          />
        ))}
        {singularLoops.map(({ rotatedLoop }) => (
          <Polygon
            strokeColor={'black'}
            strokeWidth={0.3}
            somePoints={getRotatedLoopPoints({
              sampleCount: 256,
              someRotatedLoop: rotatedLoop,
            })}
          />
        ))}
        <Polygon
          strokeColor={'black'}
          strokeWidth={0.3}
          somePoints={getCompositeLoopPoints({
            sampleCount: 256,
            baseLoops: fooLoops,
          }).map((somePoint) =>
            getMirroredPoint({
              basePoint: somePoint,
              originPoint: rootCircle.center,
              mirrorAngle: Math.PI / 8 + Math.PI / 4,
            })
          )}
        />
      </g>
    </svg>
  )
}

export interface MapRhythmSequenceApi<SomeCellResult extends any> {
  baseRhythm: DiscreteRhythm
  getCellResult: (api: {
    rhythmResolution: number
    rhythmDensity: number
    rhythmIndex: number
    nestIndex: number
  }) => SomeCellResult
}

function mapRhythmSequence<SomePropertyResult extends any>(
  api: MapRhythmSequenceApi<SomePropertyResult>
): Array<SomePropertyResult> {
  const { baseRhythm, getCellResult } = api
  const rhythmIndices = getElementIndices({
    targetValue: true,
    someSpace: baseRhythm,
  })
  const rhythmResolution = baseRhythm.length
  const rhythmDensity = rhythmIndices.length
  return rhythmIndices.map((rhythmIndex, nestIndex) =>
    getCellResult({
      rhythmResolution,
      rhythmDensity,
      rhythmIndex,
      nestIndex,
    })
  )
}

interface GetCompositeLoopPointsApi {
  sampleCount: number
  baseLoops: Array<RotatedLoop>
}

function getCompositeLoopPoints(api: GetCompositeLoopPointsApi): Array<Point> {
  const { baseLoops, sampleCount } = api
  const childCircles = baseLoops.map((someLoop) =>
    getRotatedLoopChildCircle({
      someRotatedLoop: someLoop,
    })
  )
  const compositeAccumulatedCenter = childCircles.reduce<Point>(
    (result, someChildCircle) => {
      return {
        x: someChildCircle.center.x + result.x,
        y: someChildCircle.center.y + result.y,
      }
    },
    { x: 0, y: 0 }
  )
  const compositeCenter: Point = {
    x: compositeAccumulatedCenter.x / baseLoops.length,
    y: compositeAccumulatedCenter.y / baseLoops.length,
  }
  return new Array(sampleCount).fill(undefined).map<Point>((_, sampleIndex) => {
    const [accumulatedVectorX, accumulatedVectorY] = baseLoops.reduce<
      [x: number, y: number]
    >(
      ([resultX, resultY], someLoop, loopIndex) => {
        const loopChildCenter = childCircles[loopIndex]!.center
        const loopPoint = getTracePoint({
          originPoint: loopChildCenter,
          somePoints: getRotatedLoopPoints({
            sampleCount,
            someRotatedLoop: someLoop,
          }),
          traceAngle: ((2 * Math.PI) / sampleCount) * sampleIndex,
        })
        const distanceX = loopPoint.x - loopChildCenter.x
        const distanceY = loopPoint.y - loopChildCenter.y
        return [distanceX + resultX, distanceY + resultY]
      },
      [0, 0]
    )
    return {
      x: accumulatedVectorX / baseLoops.length + compositeCenter.x,
      y: accumulatedVectorY / baseLoops.length + compositeCenter.y,
    }
  })
}

interface GetLoopGroupsApi {
  someLoops: Array<RotatedLoop>
}

function getLoopGroups(api: GetLoopGroupsApi) {
  const { someLoops } = api
  return someLoops.reduce<Array<Array<RotatedLoop>>>(
    (result, someLoop, loopIndex) => {
      const remainingLoops = someLoops.filter(
        (_, otherLoopIndex) =>
          otherLoopIndex !== loopIndex &&
          result.findIndex((someLoopGroup) =>
            someLoopGroup.find(
              (someConflictLoop) => someConflictLoop === someLoop
            )
          ) === -1
      )
      const conflictingLoops = getConflictingRotatedLoops({
        remainingLoops,
        rootLoops: remainingLoops,
        currentLoop: someLoop,
        conflictingLoops: [],
      })
      return conflictingLoops.length > 0
        ? [...result, [...conflictingLoops, someLoop]]
        : result
    },
    []
  )
}

interface GetConflictingRotatedLoopsApi {
  rootLoops: Array<RotatedLoop>
  currentLoop: RotatedLoop
  remainingLoops: Array<RotatedLoop>
  conflictingLoops: Array<RotatedLoop>
}

function getConflictingRotatedLoops(
  api: GetConflictingRotatedLoopsApi
): Array<RotatedLoop> {
  const { rootLoops, currentLoop, remainingLoops, conflictingLoops } = api
  const [loopUnderInspection, ...nextRemainingLoops] = remainingLoops
  return loopUnderInspection
    ? getRotatedLoopsCollide({
        loopA: currentLoop,
        loopB: loopUnderInspection,
      })
      ? getConflictingRotatedLoops({
          rootLoops,
          currentLoop,
          remainingLoops: nextRemainingLoops,
          conflictingLoops: [
            loopUnderInspection,
            ...conflictingLoops,
            ...getConflictingRotatedLoops({
              rootLoops,
              currentLoop: loopUnderInspection,
              remainingLoops: rootLoops.filter(
                (someLoop) =>
                  someLoop !== currentLoop && someLoop !== loopUnderInspection
              ),
              conflictingLoops: [],
            }),
          ],
        })
      : getConflictingRotatedLoops({
          rootLoops,
          currentLoop,
          conflictingLoops,
          remainingLoops: nextRemainingLoops,
        })
    : conflictingLoops
}

interface GetRotatedLoopsCollideApi {
  loopA: RotatedLoop
  loopB: RotatedLoop
}

function getRotatedLoopsCollide(api: GetRotatedLoopsCollideApi): boolean {
  const { loopA, loopB } = api
  const distanceBetweenBaseCircleCenters = getDistanceBetweenPoints({
    pointA: loopA.baseCircle.center,
    pointB: loopB.baseCircle.center,
  })
  return (
    loopA.baseCircle.radius + loopB.baseCircle.radius >=
    distanceBetweenBaseCircleCenters
  )
}

interface GetDistanceBetweenPointsApi {
  pointA: Point
  pointB: Point
}

function getDistanceBetweenPoints(api: GetDistanceBetweenPointsApi): number {
  const { pointA, pointB } = api
  const deltaX = pointB.x - pointA.x
  const deltaY = pointB.y - pointA.y
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
}
