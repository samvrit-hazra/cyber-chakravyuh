import os
import logging
from typing import Optional, List
import numpy as np

logger = logging.getLogger(__name__)

# Cache loaded booster instances in memory
_STRUCTURING_MODEL = None
_ILLICIT_MODEL = None

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
STRUCTURING_MODEL_PATH = os.path.join(MODELS_DIR, "xgb_structuring_classifier.json")
ILLICIT_MODEL_PATH = os.path.join(MODELS_DIR, "xgb_illicit_classifier.json")


def load_structuring_model():
    """Load the 9-feature XGBoost structuring classifier."""
    global _STRUCTURING_MODEL
    if _STRUCTURING_MODEL is not None:
        return _STRUCTURING_MODEL

    try:
        import xgboost as xgb
        if os.path.exists(STRUCTURING_MODEL_PATH):
            booster = xgb.Booster()
            booster.load_model(STRUCTURING_MODEL_PATH)
            _STRUCTURING_MODEL = booster
            logger.info(f"Loaded XGBoost structuring model from {STRUCTURING_MODEL_PATH}")
            return _STRUCTURING_MODEL
        else:
            logger.warning(f"Model file not found at {STRUCTURING_MODEL_PATH}")
    except Exception as exc:
        logger.error(f"Error loading structuring classifier: {exc}")
    return None


def load_illicit_model():
    """Load the 170-feature XGBoost illicit transaction classifier."""
    global _ILLICIT_MODEL
    if _ILLICIT_MODEL is not None:
        return _ILLICIT_MODEL

    try:
        import xgboost as xgb
        if os.path.exists(ILLICIT_MODEL_PATH):
            booster = xgb.Booster()
            booster.load_model(ILLICIT_MODEL_PATH)
            _ILLICIT_MODEL = booster
            logger.info(f"Loaded XGBoost illicit model from {ILLICIT_MODEL_PATH}")
            return _ILLICIT_MODEL
        else:
            logger.warning(f"Model file not found at {ILLICIT_MODEL_PATH}")
    except Exception as exc:
        logger.error(f"Error loading illicit classifier: {exc}")
    return None


def predict_structuring_risk(feature_vector: List[float]) -> Optional[float]:
    """
    Feeds the 9-value feature vector into the XGBoost structuring model.
    Returns:
        Probability float in range [0.0, 1.0], or None if model unavailable.
    """
    model = load_structuring_model()
    if model is None:
        return None

    try:
        import xgboost as xgb
        data = np.array([feature_vector], dtype=np.float32)
        dmatrix = xgb.DMatrix(data)
        preds = model.predict(dmatrix)
        score = float(preds[0])
        return max(0.0, min(1.0, score))
    except Exception as e:
        logger.error(f"Error during structuring inference: {e}")
        return None


def predict_illicit_risk(feature_vector: List[float]) -> Optional[float]:
    """
    Feeds 170-value feature vector into illicit transaction model.
    """
    model = load_illicit_model()
    if model is None:
        return None

    try:
        import xgboost as xgb
        data = np.array([feature_vector], dtype=np.float32)
        dmatrix = xgb.DMatrix(data)
        preds = model.predict(dmatrix)
        score = float(preds[0])
        return max(0.0, min(1.0, score))
    except Exception as e:
        logger.error(f"Error during illicit inference: {e}")
        return None


# Preload on import
try:
    load_structuring_model()
    load_illicit_model()
except Exception:
    pass
