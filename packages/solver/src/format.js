import { FormatType, GamePlatform } from "./types";
import OCR_DATASETS from "../data/ocr-datasets.json";
import { DifficultyInfo } from "./difficulty";
const OcrDatasets = OCR_DATASETS;
export const Formats = {
    [FormatType.SEARCH_HARD]: {
        platform: GamePlatform.SEARCH,
        difficulty: DifficultyInfo.HARD,
        ocrDataset: OcrDatasets.SEARCH_HARD
    },
    [FormatType.SEARCH_MEDIUM]: {
        platform: GamePlatform.SEARCH,
        difficulty: DifficultyInfo.MEDIUM,
        ocrDataset: OcrDatasets.SEARCH_MEDIUM
    },
    [FormatType.SEARCH_EASY]: {
        platform: GamePlatform.SEARCH,
        difficulty: DifficultyInfo.EASY,
        ocrDataset: OcrDatasets.SEARCH_EASY
    },
    [FormatType.FBX_HARD]: {
        platform: GamePlatform.FBX,
        difficulty: DifficultyInfo.HARD,
        ocrDataset: OcrDatasets.FBX_HARD
    },
    [FormatType.FBX_MEDIUM]: {
        platform: GamePlatform.FBX,
        difficulty: DifficultyInfo.MEDIUM,
        ocrDataset: OcrDatasets.FBX_MEDIUM
    },
    [FormatType.FBX_EASY]: {
        platform: GamePlatform.FBX,
        difficulty: DifficultyInfo.EASY,
        ocrDataset: OcrDatasets.FBX_EASY
    }
};
