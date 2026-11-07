// excerpt, n8n@2.15.1 packages/core/src/execution-engine/workflow-execute.ts lines 1606-1705 (raw.githubusercontent.com/n8n-io/n8n/n8n@2.15.1/...)
					// Future: May introduce dedicated nodeExecutionPaused/nodeExecutionResumed events
					// if we need finer-grained visibility into the pause/resume cycle.
					if (!executionData.metadata?.nodeWasResumed) {
						await hooks.runHook('nodeExecuteBefore', [executionNode.name, taskStartedData]);
					}
					let maxTries = 1;
					if (executionData.node.retryOnFail === true) {
						// TODO: Remove the hardcoded default-values here and also in NodeSettings.vue
						maxTries = Math.min(5, Math.max(2, executionData.node.maxTries || 3));
					}

					let waitBetweenTries = 0;
					if (executionData.node.retryOnFail === true) {
						// TODO: Remove the hardcoded default-values here and also in NodeSettings.vue
						waitBetweenTries = Math.min(
							5000,
							Math.max(0, executionData.node.waitBetweenTries || 1000),
						);
					}

					for (let tryIndex = 0; tryIndex < maxTries; tryIndex++) {
						try {
							if (tryIndex !== 0) {
								// Reset executionError from previous error try
								executionError = undefined;
								if (waitBetweenTries !== 0) {
									// TODO: Improve that in the future and check if other nodes can
									//       be executed in the meantime

									await new Promise((resolve) => {
										setTimeout(() => {
											resolve(undefined);
										}, waitBetweenTries);
									});
								}
							}

							const { pinData } = this.runExecutionData.resultData;

							if (pinData && !executionNode.disabled && pinData[executionNode.name] !== undefined) {
								const nodePinData = pinData[executionNode.name];

								nodeSuccessData = [nodePinData]; // always zeroth runIndex
							} else {
								if (executionData.metadata?.subNodeExecutionData) {
									subNodeExecutionResults.metadata =
										executionData.metadata.subNodeExecutionData.metadata;
									for (const subNode of executionData.metadata.subNodeExecutionData.actions) {
										const nodeRunData = this.runExecutionData.resultData.runData[subNode.nodeName];
										if (nodeRunData && nodeRunData[subNode.runIndex]) {
											const data = nodeRunData[subNode.runIndex];
											subNodeExecutionResults.actionResponses.push({
												data,
												action: subNode.action,
											});
										}
									}
								}

								Logger.debug(`Running node "${executionNode.name}" started`, {
									node: executionNode.name,
									workflowId: workflow.id,
								});

								let runNodeData = await this.runNode(
									workflow,
									executionData,
									this.runExecutionData,
									runIndex,
									this.additionalData,
									this.mode,
									this.abortController.signal,
									subNodeExecutionResults,
								);

								let nodeFailed =
									!isEngineRequest(runNodeData) &&
									runNodeData.data?.[0]?.[0]?.json?.error !== undefined;

								while (nodeFailed && tryIndex !== maxTries - 1) {
									await sleep(waitBetweenTries);

									runNodeData = await this.runNode(
										workflow,
										executionData,
										this.runExecutionData,
										runIndex,
										this.additionalData,
										this.mode,
										this.abortController.signal,
									);

									nodeFailed =
										!isEngineRequest(runNodeData) &&
										runNodeData.data?.[0]?.[0]?.json?.error !== undefined;
									tryIndex++;
								}

								// if runNodeData is Request
								if (isEngineRequest(runNodeData)) {
