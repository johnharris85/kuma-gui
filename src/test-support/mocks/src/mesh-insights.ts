import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { total, next, pageTotal } = pager(
    env('KUMA_MESH_COUNT', `${fake.datatype.number({ min: 1, max: 20 })}`),
    req,
    '/mesh-insights',
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const mesh = `${fake.hacker.noun()}-${i}`
        return {
          type: 'MeshInsight',
          name: mesh,
          creationTime: '2021-01-29T07:10:02.339031+01:00',
          modificationTime: '2021-01-29T07:29:02.314448+01:00',
          lastSync: '2021-01-29T06:29:02.314447Z',
          dataplanes: {
            total: 10,
            online: 9,
            partiallyDegraded: 1,
          },
          dataplanesByType: {
            standard: {
              total: 9,
              online: 8,
              partiallyDegraded: 1,
            },
            gateway: {
              total: 1,
              online: 1,
              partiallyDegraded: 0,
            },
          },
          policies: {
            CircuitBreaker: {
              total: 2,
            },
            FaultInjection: {
              total: 2,
            },
            HealthCheck: {
              total: 4,
            },
            MeshGatewayRoute: {
              total: 1,
            },
            MeshGateway: {
              total: 1,
            },
            ProxyTemplate: {
              total: 1,
            },
            RateLimit: {
              total: 0,
            },
            Retry: {
              total: 1,
            },
            Timeout: {
              total: 1,
            },
            TrafficLog: {
              total: 1,
            },
            TrafficPermission: {
              total: 3,
            },
            TrafficRoute: {
              total: 1,
            },
            TrafficTrace: {
              total: 3,
            },
            VirtualOutbound: {
              total: 0,
            },
            Secret: {
              total: 6,
            },
          },
          dpVersions: {
            kumaDp: {
              '1.0.4': {
                total: 3,
                online: 2,
              },
              '1.0.0-rc2': {
                total: 1,
                online: 1,
              },
              '1.0.6': {
                total: 2,
                online: 1,
              },
            },
            envoy: {
              '1.16.2': {
                total: 4,
                online: 1,
              },
              '1.14.0': {
                total: 7,
                online: 1,
              },
              '1.16.1': {
                total: 8,
                online: 1,
              },
            },
          },
          mTLS: {
            issuedBackends: {
              'ca-2': {
                total: 2,
                online: 2,
              },
              'ca-1': {
                total: 0,
                online: 0,
              },
            },
            supportedBackends: {
              'ca-2': {
                total: 6,
                online: 6,
              },
              'ca-1': {
                total: 6,
                online: 6,
              },
            },
          },
          services: {
            total: 5,
            internal: 3,
            external: 2,
          },
        }
      }),
      next,

    },
  }
}
