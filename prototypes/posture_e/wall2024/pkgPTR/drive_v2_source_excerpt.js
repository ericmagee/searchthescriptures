// n8n-nodes-base 2.15.1 (npm pack), dist/nodes/Google/Drive/v2/actions/router.js lines 51-83
    for (let i = 0; i < items.length; i++) {
        try {
            switch (googleDrive.resource) {
                case 'drive':
                    returnData.push(...(await drive[googleDrive.operation].execute.call(this, i)));
                    break;
                case 'file':
                    returnData.push(...(await file[googleDrive.operation].execute.call(this, i, items[i])));
                    break;
                case 'fileFolder':
                    returnData.push(...(await fileFolder[googleDrive.operation].execute.call(this, i)));
                    break;
                case 'folder':
                    returnData.push(...(await folder[googleDrive.operation].execute.call(this, i)));
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known`);
            }
        }
        catch (error) {
            if (this.continueOnFail()) {
                if (resource === 'file' && operation === 'download') {
                    items[i].json = { error: error.message };
                }
                else {
                    returnData.push({ json: { error: error.message } });
                }
                continue;
            }
            throw error;
        }
    }
    return [returnData];

// file/createFromText.operation.js lines 130-141
                'Content-Length': multiPartBody.getLengthSync(),
            },
        });
        const uploadId = uploadData.id;
        qs.addParents = (0, utils_1.setParentFolder)(folderId, driveId);
        delete bodyParameters.parents;
        const responseData = await transport_1.googleApiRequest.call(this, 'PATCH', `/drive/v3/files/${uploadId}`, bodyParameters, qs);
        response = { id: responseData.id };
    }
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response), { itemData: { item: i } });
    return executionData;
}

// n8n-nodes-base 3.2.1 (npm newest), same router.js loop, lines 51-80
    for (let i = 0; i < items.length; i++) {
        try {
            switch (googleDrive.resource) {
                case 'drive':
                    returnData.push(...(await drive[googleDrive.operation].execute.call(this, i)));
                    break;
                case 'file':
                    returnData.push(...(await file[googleDrive.operation].execute.call(this, i, items[i])));
                    break;
                case 'fileFolder':
                    returnData.push(...(await fileFolder[googleDrive.operation].execute.call(this, i)));
                    break;
                case 'folder':
                    returnData.push(...(await folder[googleDrive.operation].execute.call(this, i)));
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known`);
            }
        }
        catch (error) {
            if (!this.continueOnFail()) {
                throw error;
            }
            returnData.push({ json: { error: error.message } });
        }
    }
    return [returnData];
}
//# sourceMappingURL=router.js.map