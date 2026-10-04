"""
Sentinel AI - Rice Leaf Disease Classification Model
MobileNetV2 Transfer Learning Architecture for 5 Rice Leaf Classes:
1. Healthy
2. BacterialBlight
3. Blast
4. BrownSpot
5. Tungro

Strictly complies with Master Build Spec Section 1B & Section 6:
- Replaced 1000-class ImageNet head with 5-class head.
- Real softmax output (never clamped, never arbitrary modulo).
"""

import torch
import torch.nn as nn
from torchvision.models import mobilenet_v2, MobileNet_V2_Weights
from typing import Dict, Any, List, Tuple
from PIL import Image
from torchvision import transforms


CLASS_NAMES: List[str] = [
    "Healthy",
    "BacterialBlight",
    "Blast",
    "BrownSpot",
    "Tungro"
]

# Standard ImageNet normalization parameters
IMAGE_SIZE = 224
NORM_MEAN = [0.485, 0.456, 0.406]
NORM_STD = [0.229, 0.224, 0.225]


def get_inference_transforms():
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=NORM_MEAN, std=NORM_STD)
    ])


def get_training_transforms():
    return transforms.Compose([
        transforms.RandomResizedCrop(IMAGE_SIZE, scale=(0.7, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=25),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=NORM_MEAN, std=NORM_STD)
    ])


class RiceLeafMobileNetV2(nn.Module):
    """
    MobileNetV2 with custom classification head for 5 rice classes.
    """
    def __init__(self, num_classes: int = 5, pretrained: bool = True):
        super(RiceLeafMobileNetV2, self).__init__()
        weights = MobileNet_V2_Weights.DEFAULT if pretrained else None
        self.backbone = mobilenet_v2(weights=weights)
        
        # Replace the 1000-class classifier head
        # In MobileNetV2: backbone.classifier is Sequential(Dropout(0.2), Linear(1280, 1000))
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.25),
            nn.Linear(in_features, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.backbone(x)

    def predict_image(self, image: Image.Image, device: str = "cpu") -> Dict[str, Any]:
        """
        Runs inference on a PIL image and returns REAL softmax probabilities.
        NO hardcoding, NO clamping, NO modulo operations.
        """
        self.eval()
        self.to(device)
        transform = get_inference_transforms()
        
        # Convert to RGB if needed (handles RGBA or Grayscale)
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        tensor = transform(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            logits = self.forward(tensor)
            # Compute true softmax probabilities
            probabilities = torch.softmax(logits, dim=1).squeeze(0).cpu().numpy()
            
        pred_idx = int(probabilities.argmax())
        pred_class = CLASS_NAMES[pred_idx]
        confidence = float(probabilities[pred_idx])
        
        all_probs = {
            CLASS_NAMES[i]: float(round(float(probabilities[i]), 4))
            for i in range(len(CLASS_NAMES))
        }

        return {
            "predicted_class": pred_class,
            "confidence": round(confidence, 4),
            "class_probabilities": all_probs,
            "is_healthy": pred_class == "Healthy"
        }
