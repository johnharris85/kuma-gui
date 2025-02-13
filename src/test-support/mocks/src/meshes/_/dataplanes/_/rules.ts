import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {},
    body: {
      total: 10,
      items: [
        {
          type: 'SingleItem',
          name: '',
          policyType: 'MeshTrace',
          subset: {},
          conf: {
            backends: [
              {
                zipkin: {
                  url: 'http://foo.com/trace',
                  apiVersion: 'httpJson',
                },
              },
            ],
            tags: [
              {
                name: 'team',
                literal: 'core',
              },
            ],
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'DestinationSubset',
          name: 'demo-app_kuma-demo_svc_5000',
          addresses: [
            'demo-app_kuma-demo_svc_5000.mesh:80',
            'demo-app.kuma-demo.svc.5000.mesh:80',
            '240.0.0.1:80',
          ],
          service: 'demo-app_kuma-demo_svc_5000',
          tags: {
            'kuma.io/service': 'demo-app_kuma-demo_svc_5000',
          },
          policyType: 'MeshCircuitBreaker',
          subset: {},
          conf: {
            connectionLimits: {
              maxConnections: 1,
              maxConnectionPools: 1,
              maxPendingRequests: 1,
              maxRetries: 1,
              maxRequests: 1,
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'ClientSubset',
          name: 'demo-app_kuma-demo_svc_5000-4ba7baca08e17436',
          addresses: [
            '10.42.0.6:5000',
          ],
          service: 'demo-app_kuma-demo_svc_5000',
          tags: {
            app: 'demo-app',
            'k8s.kuma.io/namespace': 'kuma-demo',
            'k8s.kuma.io/service-name': 'demo-app',
            'k8s.kuma.io/service-port': '5000',
            'kuma.io/protocol': 'http',
            'kuma.io/service': 'demo-app_kuma-demo_svc_5000',
            'pod-template-hash': '7458cfdd75',
          },
          policyType: 'MeshCircuitBreaker',
          subset: {},
          conf: {
            connectionLimits: {
              maxConnections: 1,
              maxConnectionPools: 1,
              maxPendingRequests: 1,
              maxRetries: 1,
              maxRequests: 1,
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'ClientSubset',
          name: 'demo-app_kuma-demo_svc_5000-4ba7baca08e17436',
          addresses: [
            '10.42.0.6:5000',
          ],
          service: 'demo-app_kuma-demo_svc_5000',
          tags: {
            app: 'demo-app',
            'k8s.kuma.io/namespace': 'kuma-demo',
            'k8s.kuma.io/service-name': 'demo-app',
            'k8s.kuma.io/service-port': '5000',
            'kuma.io/protocol': 'http',
            'kuma.io/service': 'demo-app_kuma-demo_svc_5000',
            'pod-template-hash': '7458cfdd75',
          },
          policyType: 'MeshRateLimit',
          subset: {},
          conf: {
            local: {
              http: {
                requestRate: {
                  num: 1,
                  interval: '10s',
                },
                onRateLimit: {
                  status: 429,
                  headers: [
                    {
                      key: 'x-kuma-rate-limited',
                      value: 'true',
                      append: true,
                    },
                  ],
                },
              },
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'DestinationSubset',
          name: 'demo-app_kuma-demo_svc_5000-bcddbc050bd58f67',
          addresses: [
            'demo-app.mesh:5000',
            '240.0.0.5:5000',
          ],
          service: 'demo-app_kuma-demo_svc_5000',
          tags: {
            'k8s.kuma.io/service-name': 'demo-app',
            'k8s.kuma.io/service-port': '5000',
            'kuma.io/service': 'demo-app_kuma-demo_svc_5000',
          },
          policyType: 'MeshCircuitBreaker',
          subset: {},
          conf: {
            connectionLimits: {
              maxConnections: 1,
              maxConnectionPools: 1,
              maxPendingRequests: 1,
              maxRetries: 1,
              maxRequests: 1,
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'DestinationSubset',
          name: 'redis_kuma-demo_svc_6379',
          addresses: [
            'redis_kuma-demo_svc_6379.mesh:80',
            'redis.kuma-demo.svc.6379.mesh:80',
            '240.0.0.0:80',
          ],
          service: 'redis_kuma-demo_svc_6379',
          tags: {
            'kuma.io/service': 'redis_kuma-demo_svc_6379',
          },
          policyType: 'MeshRetry',
          subset: {
            'kuma.io/service': 'redis_kuma-demo_svc_6379',
          },
          conf: {
            tcp: {
              maxConnectAttempt: 5,
            },
            http: {
              numRetries: 10,
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'DestinationSubset',
          name: 'redis_kuma-demo_svc_6379',
          addresses: [
            'redis_kuma-demo_svc_6379.mesh:80',
            'redis.kuma-demo.svc.6379.mesh:80',
            '240.0.0.0:80',
          ],
          service: 'redis_kuma-demo_svc_6379',
          tags: {
            'kuma.io/service': 'redis_kuma-demo_svc_6379',
          },
          policyType: 'MeshCircuitBreaker',
          subset: {},
          conf: {
            connectionLimits: {
              maxConnections: 1,
              maxConnectionPools: 1,
              maxPendingRequests: 1,
              maxRetries: 1,
              maxRequests: 1,
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'DestinationSubset',
          name: 'redis_kuma-demo_svc_6379-34f959536d1337f2',
          addresses: [
            'redis.mesh:6379',
            '240.0.0.6:6379',
          ],
          service: 'redis_kuma-demo_svc_6379',
          tags: {
            'k8s.kuma.io/service-name': 'redis',
            'k8s.kuma.io/service-port': '6379',
            'kuma.io/service': 'redis_kuma-demo_svc_6379',
          },
          policyType: 'MeshRetry',
          subset: {
            'kuma.io/service': 'redis_kuma-demo_svc_6379',
          },
          conf: {
            tcp: {
              maxConnectAttempt: 5,
            },
            http: {
              numRetries: 10,
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'DestinationSubset',
          name: 'redis_kuma-demo_svc_6379-34f959536d1337f2',
          addresses: [
            'redis.mesh:6379',
            '240.0.0.6:6379',
          ],
          service: 'redis_kuma-demo_svc_6379',
          tags: {
            'k8s.kuma.io/service-name': 'redis',
            'k8s.kuma.io/service-port': '6379',
            'kuma.io/service': 'redis_kuma-demo_svc_6379',
          },
          policyType: 'MeshCircuitBreaker',
          subset: {},
          conf: {
            connectionLimits: {
              maxConnections: 1,
              maxConnectionPools: 1,
              maxPendingRequests: 1,
              maxRetries: 1,
              maxRequests: 1,
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
        {
          type: 'DestinationSubset',
          name: 'svclb-demo-app-gateway_kuma-demo_svc',
          addresses: [
            'svclb-demo-app-gateway_kuma-demo_svc.mesh:80',
            'svclb-demo-app-gateway.kuma-demo.svc.mesh:80',
            '240.0.0.2:80',
          ],
          service: 'svclb-demo-app-gateway_kuma-demo_svc',
          tags: {
            'kuma.io/service': 'svclb-demo-app-gateway_kuma-demo_svc',
          },
          policyType: 'MeshCircuitBreaker',
          subset: {},
          conf: {
            connectionLimits: {
              maxConnections: 1,
              maxConnectionPools: 1,
              maxPendingRequests: 1,
              maxRetries: 1,
              maxRequests: 1,
            },
          },
          origins: [
            {
              mesh: 'default',
              name: 'all.kuma-system',
            },
          ],
        },
      ],
    },
  }
}
