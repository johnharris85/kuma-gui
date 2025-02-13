import type { EndpointDependencies, MockResponder } from '@/test-support'
export default ({ fake, pager, env }: EndpointDependencies): MockResponder => (req) => {
  const { offset, total, next, pageTotal } = pager(
    env('KUMA_ZONE_COUNT', `${fake.datatype.number({ min: 1, max: 1000 })}`),
    req,
    '/zones+insights',
  )

  return {
    headers: {},
    body: {
      total,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const name = `${fake.hacker.noun()}-${id}`
        return {
          type: 'ZoneOverview',
          name,
          creationTime: '2021-02-19T08:06:15.380674+01:00',
          modificationTime: '2021-02-19T08:06:15.380674+01:00',
          zone: {
            enabled: true,
          },
          ...(true && {
            zoneInsight: {
              subscriptions: [
                {
                  config: '{"apiServer":{"auth":{"allowFromLocalhost":true,"clientCertsDir":""},"corsAllowedDomains":[".*"],"http":{"enabled":true,"interface":"0.0.0.0","port":6681},"https":{"enabled":true,"interface":"0.0.0.0","port":6682,"tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key"},"readOnly":false},"bootstrapServer":{"apiVersion":"v3","params":{"adminAccessLogPath":"/dev/null","adminAddress":"127.0.0.1","adminPort":0,"xdsConnectTimeout":"1s","xdsHost":"","xdsPort":5678}},"defaults":{"skipMeshCreation":false},"diagnostics":{"debugEndpoints":false,"serverPort":6680},"dnsServer":{"CIDR":"240.0.0.0/4","domain":"mesh","port":5653},"dpServer":{"auth":{"type":"dpToken"},"hds":{"checkDefaults":{"healthyThreshold":1,"interval":"1s","noTrafficInterval":"1s","timeout":"2s","unhealthyThreshold":1},"enabled":true,"interval":"5s","refreshInterval":"10s"},"port":5678,"tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key"},"environment":"universal","general":{"dnsCacheTTL":"10s","tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key","workDir":"/Users/tomasz.wylezek/.kuma"},"guiServer":{"apiServerUrl":""},"metrics":{"dataplane":{"enabled":true,"idleTimeout":"5m0s","subscriptionLimit":2},"mesh":{"maxResyncTimeout":"20s","minResyncTimeout":"1s"},"zone":{"enabled":true,"idleTimeout":"5m0s","subscriptionLimit":10}},"mode":"zone","monitoringAssignmentServer":{"apiVersions":["v1"],"assignmentRefreshInterval":"1s","defaultFetchTimeout":"30s","grpcPort":0,"port":5676},"multizone":{"global":{"kds":{"grpcPort":5685,"maxMsgSize":10485760,"refreshInterval":"1s","tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key","zoneInsightFlushInterval":"10s"}},"zone":{"globalAddress":"grpcs://localhost:5685","kds":{"maxMsgSize":10485760,"refreshInterval":"1s","rootCaFile":""},"name":"cluster-1"}},"reports":{"enabled":true},"runtime":{"kubernetes":{"admissionServer":{"address":"","certDir":"","port":5443},"controlPlaneServiceName":"kuma-control-plane","injector":{"builtinDNS":{"enabled":true,"port":15053},"caCertFile":"","cniEnabled":false,"exceptions":{"labels":{"openshift.io/build.name":"*","openshift.io/deployer-pod-for.name":"*"}},"initContainer":{"image":"kuma/kuma-init:latest"},"sidecarContainer":{"adminPort":9901,"drainTime":"30s","envVars":{},"gid":5678,"image":"kuma/kuma-dp:latest","livenessProbe":{"failureThreshold":12,"initialDelaySeconds":60,"periodSeconds":5,"timeoutSeconds":3},"readinessProbe":{"failureThreshold":12,"initialDelaySeconds":1,"periodSeconds":5,"successThreshold":1,"timeoutSeconds":3},"redirectPortInbound":15006,"redirectPortInboundV6":15010,"redirectPortOutbound":15001,"resources":{"limits":{"cpu":"1000m","memory":"512Mi"},"requests":{"cpu":"50m","memory":"64Mi"}},"uid":5678},"sidecarTraffic":{"excludeInboundPorts":[],"excludeOutboundPorts":[]},"virtualProbesEnabled":true,"virtualProbesPort":9000},"marshalingCacheExpirationTime":"5m0s"},"universal":{"dataplaneCleanupAge":"72h0m0s"}},"store":{"cache":{"enabled":true,"expirationTime":"1s"},"kubernetes":{"systemNamespace":"kuma-system"},"postgres":{"connectionTimeout":5,"dbName":"kuma","host":"127.0.0.1","maxIdleConnections":0,"maxOpenConnections":0,"maxReconnectInterval":"1m0s","minReconnectInterval":"10s","password":"*****","port":15432,"tls":{"caPath":"","certPath":"","keyPath":"","mode":"disable"},"user":"kuma"},"type":"memory","upsert":{"conflictRetryBaseBackoff":"100ms","conflictRetryMaxTimes":5}},"xdsServer":{"dataplaneConfigurationRefreshInterval":"1s","dataplaneStatusFlushInterval":"10s","nackBackoff":"5s"}}',
                  id: 'b21265cf-f856-4214-ad1b-42539c4b20a9',
                  globalInstanceId: 'foobar',
                  connectTime: '2020-07-28T16:08:09.743141Z',
                  disconnectTime: '2020-07-28T16:08:09.743194Z',
                  status: {
                    lastUpdateTime: '2021-02-19T07:06:16.384057Z',
                    total: {
                      responsesSent: '14',
                      responsesAcknowledged: '14',
                    },
                    stat: {
                      CircuitBreaker: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Config: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Dataplane: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      ExternalService: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      FaultInjection: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      HealthCheck: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Mesh: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      ProxyTemplate: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Retry: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Secret: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      TrafficLog: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      TrafficPermission: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      TrafficRoute: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      TrafficTrace: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                    },
                  },
                  version: {
                    kumaCp: {
                      version: '1.0.0-rc2-211-g823fe8ce',
                      gitTag: '1.0.0-rc2-211-g823fe8ce',
                      gitCommit: '823fe8cef6430a8f75e72a7224eb5a8ab571ec42',
                      buildDate: '2021-02-18T13:22:30Z',
                    },
                  },
                },
                {
                  config: '{"apiServer":{"auth":{"allowFromLocalhost":true,"clientCertsDir":""},"corsAllowedDomains":[".*"],"http":{"enabled":true,"interface":"0.0.0.0","port":6681},"https":{"enabled":true,"interface":"0.0.0.0","port":6682,"tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key"},"readOnly":false},"bootstrapServer":{"apiVersion":"v3","params":{"adminAccessLogPath":"/dev/null","adminAddress":"127.0.0.1","adminPort":0,"xdsConnectTimeout":"1s","xdsHost":"","xdsPort":5678}},"defaults":{"skipMeshCreation":false},"diagnostics":{"debugEndpoints":false,"serverPort":6680},"dnsServer":{"CIDR":"240.0.0.0/4","domain":"mesh","port":5653},"dpServer":{"auth":{"type":"dpToken"},"hds":{"checkDefaults":{"healthyThreshold":1,"interval":"1s","noTrafficInterval":"1s","timeout":"2s","unhealthyThreshold":1},"enabled":true,"interval":"5s","refreshInterval":"10s"},"port":5678,"tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key"},"environment":"universal","general":{"dnsCacheTTL":"10s","tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key","workDir":"/Users/tomasz.wylezek/.kuma"},"guiServer":{"apiServerUrl":""},"metrics":{"dataplane":{"enabled":true,"idleTimeout":"5m0s","subscriptionLimit":2},"mesh":{"maxResyncTimeout":"20s","minResyncTimeout":"1s"},"zone":{"enabled":true,"idleTimeout":"5m0s","subscriptionLimit":10}},"mode":"zone","monitoringAssignmentServer":{"apiVersions":["v1"],"assignmentRefreshInterval":"1s","defaultFetchTimeout":"30s","grpcPort":0,"port":5676},"multizone":{"global":{"kds":{"grpcPort":5685,"maxMsgSize":10485760,"refreshInterval":"1s","tlsCertFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.crt","tlsKeyFile":"/Users/tomasz.wylezek/.kuma/kuma-cp.key","zoneInsightFlushInterval":"10s"}},"zone":{"globalAddress":"grpcs://localhost:5685","kds":{"maxMsgSize":10485760,"refreshInterval":"1s","rootCaFile":""},"name":"cluster-1"}},"reports":{"enabled":true},"runtime":{"kubernetes":{"admissionServer":{"address":"","certDir":"","port":5443},"controlPlaneServiceName":"kuma-control-plane","injector":{"builtinDNS":{"enabled":true,"port":15053},"caCertFile":"","cniEnabled":false,"exceptions":{"labels":{"openshift.io/build.name":"*","openshift.io/deployer-pod-for.name":"*"}},"initContainer":{"image":"kuma/kuma-init:latest"},"sidecarContainer":{"adminPort":9901,"drainTime":"30s","envVars":{},"gid":5678,"image":"kuma/kuma-dp:latest","livenessProbe":{"failureThreshold":12,"initialDelaySeconds":60,"periodSeconds":5,"timeoutSeconds":3},"readinessProbe":{"failureThreshold":12,"initialDelaySeconds":1,"periodSeconds":5,"successThreshold":1,"timeoutSeconds":3},"redirectPortInbound":15006,"redirectPortInboundV6":15010,"redirectPortOutbound":15001,"resources":{"limits":{"cpu":"1000m","memory":"512Mi"},"requests":{"cpu":"50m","memory":"64Mi"}},"uid":5678},"sidecarTraffic":{"excludeInboundPorts":[],"excludeOutboundPorts":[]},"virtualProbesEnabled":true,"virtualProbesPort":9000},"marshalingCacheExpirationTime":"5m0s"},"universal":{"dataplaneCleanupAge":"72h0m0s"}},"store":{"cache":{"enabled":true,"expirationTime":"1s"},"kubernetes":{"systemNamespace":"kuma-system"},"postgres":{"connectionTimeout":5,"dbName":"kuma","host":"127.0.0.1","maxIdleConnections":0,"maxOpenConnections":0,"maxReconnectInterval":"1m0s","minReconnectInterval":"10s","password":"*****","port":15432,"tls":{"caPath":"","certPath":"","keyPath":"","mode":"disable"},"user":"kuma"},"type":"memory","upsert":{"conflictRetryBaseBackoff":"100ms","conflictRetryMaxTimes":5}},"xdsServer":{"dataplaneConfigurationRefreshInterval":"1s","dataplaneStatusFlushInterval":"10s","nackBackoff":"5s"}}',
                  id: '3d3b7a11-e0f9-4f70-8cc9-2594318488d3',
                  globalInstanceId: 'MacBook-Pro-Bartlomiej.local-9e52',
                  connectTime: '2021-02-19T07:07:15.535286Z',
                  status: {
                    lastUpdateTime: '2021-02-19T07:07:15.537654Z',
                    total: {
                      responsesSent: '14',
                      responsesAcknowledged: '14',
                    },
                    stat: {
                      CircuitBreaker: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Config: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Dataplane: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      ExternalService: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      FaultInjection: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      HealthCheck: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Mesh: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      ProxyTemplate: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Retry: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      Secret: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      TrafficLog: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      TrafficPermission: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      TrafficRoute: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                      TrafficTrace: {
                        responsesSent: '1',
                        responsesAcknowledged: '1',
                      },
                    },
                  },
                  version: {
                    kumaCp: {
                      version: '1.0.0-rc2-211-g823fe8ce',
                      gitTag: '1.0.0-rc2-211-g823fe8ce',
                      gitCommit: '823fe8cef6430a8f75e72a7224eb5a8ab571ec42',
                      buildDate: '2021-02-18T13:22:30Z',
                      kumaCpGlobalCompatible: false,
                    },
                  },
                },
              ],
            },
          }),
        }
      }),
      next,
    },
  }
}
