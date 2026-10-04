"""
Sentinel AI - Rice Leaf Classifier Standalone Evaluation Script
Evaluates model.pt against validation dataset and writes metrics.json.
Reports honesty: accuracy, per-class precision/recall/F1, and confusion matrix.
Complies with Master Build Spec Section 1B Step 5.
"""

import os
import json
import torch
import numpy as np
from torch.utils.data import DataLoader, Subset
from torchvision.datasets import ImageFolder
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

from model import RiceLeafMobileNetV2, CLASS_NAMES, get_inference_transforms
from train import TransformedSubset


def evaluate_saved_model(base_dir: str):
    model_path = os.path.join(base_dir, "model.pt")
    metrics_path = os.path.join(base_dir, "metrics.json")
    dataset_folder = os.path.join(base_dir, "dataset")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}. Run train.py first.")

    raw_dataset = ImageFolder(dataset_folder)
    targets = raw_dataset.targets

    # Recreate the exact same 20% validation split
    sss = StratifiedShuffleSplit(n_splits=1, test_size=0.20, random_state=42)
    _, val_idx = next(sss.split(np.zeros(len(targets)), targets))

    val_subset = Subset(raw_dataset, val_idx)
    val_data = TransformedSubset(val_subset, get_inference_transforms())
    val_loader = DataLoader(val_data, batch_size=16, shuffle=False)

    # Load model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = RiceLeafMobileNetV2(num_classes=5, pretrained=False)
    model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
    model.to(device)
    model.eval()

    val_preds = []
    val_trues = []

    with torch.no_grad():
        for batch_x, batch_y in val_loader:
            batch_x = batch_x.to(device)
            outputs = model(batch_x)
            preds = outputs.argmax(dim=1).cpu().numpy()
            val_preds.extend(preds)
            val_trues.extend(batch_y.numpy())

    val_acc = float(accuracy_score(val_trues, val_preds))
    precision, recall, f1, support = precision_recall_fscore_support(
        val_trues, val_preds, labels=range(len(CLASS_NAMES)), zero_division=0
    )
    cm = confusion_matrix(val_trues, val_preds, labels=range(len(CLASS_NAMES)))

    metrics = {
        "architecture": "MobileNetV2 (Transfer Learning)",
        "classes": CLASS_NAMES,
        "validation_samples": len(val_data),
        "validation_accuracy": round(val_acc, 4),
        "per_class_metrics": {
            CLASS_NAMES[i]: {
                "precision": round(float(precision[i]), 4),
                "recall": round(float(recall[i]), 4),
                "f1_score": round(float(f1[i]), 4),
                "validation_support": int(support[i])
            }
            for i in range(len(CLASS_NAMES))
        },
        "confusion_matrix": cm.tolist(),
        "evaluation_mode": "Stratified 20% Held-out Validation Set"
    }

    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print("Evaluated model successfully. Metrics written to metrics.json")
    return metrics


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    evaluate_saved_model(base_dir)
