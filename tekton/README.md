# tekton

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
helm dependency build ../gitea

helm install gitea ../gitea \
    --namespace gitea \
    --create-namespace
```

```
kubectl apply \
  --filename https://storage.googleapis.com/tekton-releases/pipeline/previous/v0.45.0/release.yaml

kubectl apply \
  --filename https://storage.googleapis.com/tekton-releases/triggers/previous/v0.22.2/release.yaml

kubectl apply \
  --filename https://storage.googleapis.com/tekton-releases/triggers/previous/v0.22.2/interceptors.yaml
```

```mermaid
flowchart LR
  subgraph NS_gitea[Namespace gitea]
    SVC_gitea[Service gitea]
  end
  subgraph NS_tekton-gitea[Namespace tekton-gitea]
    EL_tekton-gitea[EventListener tekton-gitea]
    TT_tekton-gitea[TriggerTemplate tekton-gitea]
    TB_tekton-gitea[TriggerBinding tekton-gitea]
  end
  subgraph NS_tekton-tasks[Namespace tekton-tasks]
    PPLR_oci-image[PipelineRun oci-image]
    PPL_oci-image[Pipeline oci-image]
    subgraph TSK_git-clone[Task git-clone]
      ST_git-clone[Step clone]
    end
    subgraph TSK_docker-build[Task docker-build]
      ST_docker-build[Step build]
      ST_docker-push[Step push]
    end
  end
  subgraph NS_gitea-copy[Namespace gitea]
    SVC_gitea-copy[Service gitea]
  end
  SVC_gitea -->|webhook| EL_tekton-gitea
  EL_tekton-gitea --> TT_tekton-gitea
  EL_tekton-gitea --> TB_tekton-gitea
  TT_tekton-gitea --> PPLR_oci-image
  PPLR_oci-image --> PPL_oci-image
  PPL_oci-image --> TSK_git-clone
  PPL_oci-image --> TSK_docker-build
  ST_docker-build --> ST_docker-push
  ST_docker-push -->|push| SVC_gitea-copy
```

```
kubectl apply \
    --kustomize ./gitea

kubectl apply \
    --filename ./gitea/taskrun-gitea-org-foobar.yaml

kubectl apply \
    --filename ./gitea/taskrun-gitea-repo-app.yaml
```

```
kubectl apply \
    --kustomize ./tekton-tasks

kubectl apply \
    --kustomize ./tekton-gitea
```
