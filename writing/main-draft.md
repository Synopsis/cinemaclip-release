# Introducing CinemaCLIP

A hybrid CLIP model and taxonomy for the visual language of cinema

At OZU, our goal is to build ML systems that deeply understand the art of cinema and visual story telling. In pursuing that goal, we noticed a qualitative gap; existing ML models that bridge natural language and vision massively underperform when tasked with understanding cinematic concepts compared to humans, especially domain experts like cinematographers, editors, and directors.

To understand this gap, we first carefully created a taxonomy of cinematic concepts by working with industry specialists. We then evaluated existing models, as well as our own Cinema family of models against a new set of benchmark datasets.

What we found matched our qualitative assesement; evaluating leading CLIP models against these datasets shows a fundamental gap in their understanding of the nuances of visual grammar. Furthermore, model scale alone does not solve this problem; models up to X× larger still fail to capture the structure of cinematic visual language. This limits their usefulness in real-world professional video tasks where understanding visual language is critical.

The result of our work is a new model; CinemaCLIP, and a collection of 22 datasets that represent an extensive taxonomy of professional visual language.

< OVERALL ACCURACY DOT PLOT: CINEMACLIP VS BASELINES ACROSS CATEGORIES >

CinemaCLIP is a hybrid CLIP model that pairs zero-shot inference with specialised classification heads, outperforming existing CLIP models as well as state of the art Vision Language models in both zero shot inference and one shot classification tasks.

**Authors**  
Rahul Somani  
Anton Marini  
Damian Stewart  

**Published**  
20 Feb, 2026  

**HuggingFace**  
Released artifacts ↗  

---

## The Problem

Cinematographers, photographers, editors and directors all use very specific language to describe imagery on the job. However their language can be fuzzy, and not all cinematographers and photographers share the same opinion of when a "close up shot" begins, and a "medium shot" ends. Furthermore, industry terms of art often attempt to capture multiple competing visual concepts which lead to poor machine interpretability. 

Modern models are trained on internet scale data, of which most captions are from are non-experts, and do a poor or even incorrect job at describing an image. The result are models which have a fuzzy understanding of these specific terms of art, and are less effective when used in professional contexts.

For many use cases, internet scale data along with correct training formulations result in models that out perform non-expert users. But these models also vastly underperform when compared to trained professionals. If your use case is to build intelligent tools for professionals, this gap in performance matters. 

## The Gap In Existing Approaches

CLIP learns by matching images to captions. Whether it's the original contrastive loss or SigLIP's sigmoid formulation, the fundamental task is the same: given a batch of images and captions, figure out which caption goes with which image.

< CLIP DIAGRAM >

Crucially, what's in the caption limits what the model can learn. Existing captions from industry standard datasets capture a sliver of what's meaningful in the image. Specifically, this is an information problem: existing captions don’t consistently encode information (e.g. shot size, camera angle, composition), so the model never learns them.  The limitation is not the architecture but the dataset. Let's look at some sample data and captions to show what this really means, and why they don't work.

< LAION EXAMPLES WITH WEB LIKE CAPTIONS >

The most obvious antidote to this problem is richer captions. [LongCLIP](https://arxiv.org/abs/2403.15378) showed that most CLIP models have an effective context length of ~20 tokens (a side effect of existing datasets) and demonstrated gains from extending the actual and effective context length. In the VLM space, [Pixmo (Molmo)](https://arxiv.org/abs/2409.17146) took this further to great effect with exhaustive captions for pre-training:

< PIXMO & SHAREGPT4V ESSAY LENGTH CAPTION EXPLORER > [see this doc](./laion-pixmo-sharegpt4vcoco-examples.md)

To the untrained eye, these captions appear exhaustive, but there's often little to no information about the visual grammar of the image from the perspective of a domain expert / industry professional. 

Instead of matching concise captions to images, you're now matching essays to images. While this solves the information problem in principle, it introduces a precision problem: the model can satisfy the objective by matching whichever visual features are easiest, and ignore the rest, without ever learning structured visual concepts. 

## The solution: Decomposition

Visual language has a grammar, and this grammar is structured and consists of visual concepts that are mutually exclusive. Instead of combining them all into a single long caption, we treat this as a multi-task problem, running 8 parallel tasks that all attend to distinct aspects of the image. 

In other words, instead of asking one question: ‘what’s in this image?’, we ask multiple focused questions:
* What is the shot type?
* What is the camera angle?
* What is the lighting style?
* What is the composition? 

Each is learned independently, but from the same underlying image.

Not only is this much more readable to the human eye, it's a fundamentally better training formulation. Each task provides a clean, unambiguous training signal, preventing the model from collapsing multiple concepts into a single representation. Adding this structure allows us to learn multiple dimensions of the same image concurrently, leading to a ~14% improvement over the basic single caption formulation. This approach is also compatible with learning [negation](https://github.com/jaisidhsingh/CoN-CLIP?tab=readme-ov-file), offering additional opportunities for the model to learn appropriate features.

< EXAMPLES OF IMAGES WITH 1 CAPTION VS. 8 CAPTIONS>


< VISUAL TAXONOMY EXPLORER >

## Dataset Size

As seen above, CinemaCLIP is trained on cinematic data. Our data set consists of a validation set hand labelled (and re-labelled multiple times) by domain experts. We fine tuned domain-specific teacher models for individual aspects of visual grammar (e.g. shot type, lighting, composition), and used them to generate high-confidence labels at scale. Finally we generated our training datasets via our teacher models. We encourage you to check out our talk at [CVEU 2021](https://youtu.be/7aYgLALc_24?t=32741) for more details regarding the process.

Our data set consisted of 750k samples with human labelled tags. Another 750k images from DataComp was labeled by our teacher models to maintain a 50-50 split of generalist labels and visual domain expertise  to preserve generalist knowledge in the models. 

## Architecture (New)

Given the use cases for CinemaClip, we chose Mobile Clip S1 - a modern clip architecture that can be deployed on edge devices, and run faster than realtime. During development of CinemaClip, we've had the privilege of running inference across petabytes of video archives in various data centers and compute environments. 

This process is expensive and time consuming, and running models capable of fast inference on cheaper hardware is a huge win and enables analysis of very large archives in reasonable time for reasonable costs. This also enables local inference, for on set, and even in camera use cases. 

Mobile Clip S1 is designed to run on Apples Neural Engine, a hardware accelerated inference chip shipped with phones, laptop and desktop systems. It balances strong out of the box performance with size. 

The capabality for on device model deployment and integration into native applications allows inference to run where video resides and on available compute, be it cloud based video archives, local production or post production storage networks, or near-line local device storage.  

## Training Formulation (New)

Given our insights to captioning in our decomposition section above, we proposed a multi task training approach, where each image in a batch has 8 unique captions, 6 domain specialist tasks and 2 generalist tasks to retain knowledge and protect against catastrophic forgetting.

In addition to the 8 captioning tasks, we create 23 dedicated classification task heads - a combination of single-label, multi-label, and binary classifiers per concept. The data for these tasks was generated automatically by specialist in-house models we've developed over the past few years. See our [CVEU 2021](https://youtu.be/7aYgLALc_24?t=32741) talk from 2021 for more details.

Having strong classification performance is useful to help the models learn concepts consistently. For many use cases, having domain language classififers out performed zero shot classification and provided better overall model performance for both general knowedge and cinematic tasks. 

Additionaly, having classifiers and natural language embeddings from a single model lets you compose searches more reliably and flexibly. 

### Ablations (New)

Given that any pretrained clip model consists of 2 components, a text encoder and vision encoder, we ran ablations to determine how much of each encoder to unfreeze for training. Our intition is as follows - expert text captions are formulated differently than non expert captions. Additionally, cinematic images has a different distribution - shots are typically darker, and consist of more diverse compositions compared to product shots, advertisements and social media images which dominate the internet scale data.

We curated a subsection of our main data set and ran ablations across the text encoder and vision encoder to determine which layers to unfreeze. 

TODO: RAHUL
* x for text 
* y for vision

These findings scale with larger data sets. 

### Augmentations (New)

Augmentations were applied only on the text side. Every image augmentation applied may be relevant for one tasks, but undermines performance in another. Cinematic content is shot with intention, and augmentations destroy the salient information and build invariances where we dont want them. 

### Post Training (NEW)

Finally, we weight blend (model soup / alpha mix ) our resulting model with the pretrained model - 75% of our new fine tuned weights with 25% of the pretrained model. This last step ensures we retain generalist performance. Without it, our fine tuned model alone would perform 1-2 % better on cinematic tasks but lose %10 on general purpose tasks. Alpha mixing allows us to retain 14% better cinematic knowledge with next to no loss in general purpose performance. 

## Evaluations

Here is a categorical comparison of CinemaCLIP against the leading existing CLIP models and state of the art VLMs across all our cinematography datasets.

< CHART SHOWING 23 INDIVIDUAL CLASSIFIERS ACCURACY WITH LEGEND FOR CLARITY - SOLID DOT, OUTLINE DOT, GRAY DOT>

---

## 'General' Knowledge Retention / Improvement

We also don't want to over-specialize. Its important for our models to retain a wide understanding of general concepts so that existing functionality is retained. To that end, we validate our data set and multi task training approach by using existing datasets as proxies for generalist tasks.

< 4 CHARS OF NON-CINEMAIC TASK ACCURACY >

Note that there are many different groups of concepts within these datasets, like emotion, wardrobe, etc, many of which could command dedicated taxonomies and tasks themselves (and indeed, there are many publicly available datasets in many of these domains), but we lumped them all into two tasks as our focus was teaching CLIP the language of cinema. Coverage of these concepts is far from exhaustive throughout the dataset. Regardless, we saw a notable improvement in accuracy across most of these tasks compared to the pre-trained model. CinemaCLIP retains good generalist knowledge, and we intentionally trade ~7% ImageNet accuracy for significantly improved performance on real-world visual tasks relevant to our users. 

### Latent Space Comparisons | Text Embedding Comparisons

< CVEU LIKE SIDE BY SIDE COMPARISON >

## Conclusion

We believe CinemaCLIP offers a demonstrable improvement over CLIP and VLM models for many industry professional use cases. With a x% improvement over the latest VLMs, CinemaClip can be run on commodity hardware on edge, at greatly faster than real-time rates. This enables opportunities like real-time video search and retrieval systems, live camera assist systems, on set validation, and more. 

CinemaCLIP is one part of a family of models and techniques that we built at OZU to understand the art of visual storytelling, and is the backbone for a suite of tools and processes that power OZU's state of the art narrative understanding systems.   

We also believe that our training formulation is useful for other tasks / domains - and is a strategy that can be adopted to add domain expertise to existing pretrained clip without performance loss in other domains. 

Stay tuned for more.

# Technical Addendum

## Selected Ablations

### Alpha Mixing

We tried blending our fine-tuned model with the pre-trained one at various `alpha`s and found that `0.75` (75% fine-tuned weights, 25% pre-trained) was the best combination. Not only did we perform better at ImageNet, which was expected, but we also had superior zero-shot performance on cinematic tasks. The classifier heads were slightly worse (88% vs. 89%), which was reasonable tradeoff.

| | ImageNet 0-Shot Top-1 | Cinematic 0-Shot | Cinematic Classifiers |
|---|---|---|---|
| α = 0.5 | x | x | x |
| α = 0.75 | 63.4% | 82.2% | 87.5% |
| α = 1.0 | 57% | x | 88.5% |

### Teacher Model Labelling Threshold

Our 23 teacher models, all classifiers, provided labels for 6/8 tasks. Being classifiers, we experimented with the confidence threshold at which we decide to use the model's prediction as part of the caption. Higher confidence levels meant more high quality labels, but too high a confidence would lead to too many empty captions. In practice, 85% worked best.

| Threshold | Cinematic 0-Shot |
|---|---|
| 0.0 | 74.9% |
| 0.5 | 79.5% |
| 0.6 | 79.0% |
| 0.7 | 80.2% |
| 0.8 | 81.0% |
| 0.85 | 82.2% |

### No. of Tasks

We experimented with the ideal no. of tasks to include in our multi-task formulation. Generally, adding more tasks led to better performance. Beyond 6 cinematic tasks, there were no notable gains and with the confidence thresholding mentioned above, we ended up with over 40% of a batch having empty captions. For our formulation, 6 was the right balance. If one were to extend this to more domains, we expect performance to generally increase as long as they are well formulated. We only added expertise in the cinematic domain, and it'd be interesting to see how far this can be pushed - could we train models with a hundred domain expert tasks at once?

| No. of Captions | ImageNet 0-Shot Top-1 | Cinematic 0-Shot |
|---|---|---|
| 2 | 65.6% | 72.4% |
| 3 | 65.4% | 72.8% |
| 8 | 63.4% | 82.2% |

## On Batch Size
 
Our effective batch size was 1,152 images with 9,216 captions per batch. We were bound by our hardware constraints (3x RTX 3090s w/ 24GB VRAM each) and were unable to test if performance increases further with larger batches. Most CLIP research and practitioners' experiences suggest that larger batch sizes are better, but there hasn't been a systematic study of the effect of batch size when _fine-tuning_ CLIP models.

## Note on Training Dynamics & Hyperparameters

Fine-tuning CLIP models can be fiddly. Many parameters need to be tuned specifically to the architecture you're training. We needed to be judicious about the areas we dove deeper into. We were systematic about some ablations, as elaborated above, and lacked bandwidth to go deeper on other hyperparameters. Here is our assessment of the most significant hyperparameters:

- No. of layers fine-tuned in the vision encoder  |  6  | Sweet spot
- No. of layers fine-tuned in the text encoder  |  3  | Sweet spot
- Data ratio between pre-trained data and new data  |  50%  |  
- Confidence threshold of auto-labelled tags  |  0.85  | Identical performance on ImageNet; 0.85 led to about 10% better performance on cinematic tasks, as the training data was more precise
- No. of training tasks  |  8  | This was the sweet spot. Going longer meant losing too much 'general' knowledge for a marginal gain in cinematic understanding
- No. of epochs / steps trained  |  3 epochs  |  This was the sweet spot. Going longer meant losing too much 'general' knowledge for a marginal gain in cinematic understanding
- Learning rate  |  2e-5 for CLIP, 2e-3 for classifier heads  |  Used Leslie Smith / FastAI's LR finder technique to find the sweet spot
- Alpha blending ratio  |  0.75  |  Alpha=1.0 means fully fine-tuned ratio. This led to +1% accuracy on classifiers, equivalent 0-shot cinematic, and -7% on ImageNet

