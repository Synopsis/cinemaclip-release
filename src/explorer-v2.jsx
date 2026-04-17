import React, { useState, useEffect } from "react";
import { SECTIONS, HERO_ANNOTATIONS, HYPERPARAMETER_ROWS } from "./explorer/data.js";
import { STYLES, SPACE, LAYOUT_CONTAINERS, dividerStyle, PAGE_SHELL } from "./explorer/styles.js";
import LeftRailTOC from "./explorer/components/LeftRailTOC.jsx";
import OverallAccuracyDotPlot from "./explorer/charts/OverallAccuracyDotPlot.jsx";
import GeneralKnowledgeCharts from "./explorer/charts/GeneralKnowledgeCharts.jsx";
import { CinematicSimilarityMatrices, NonCinematicSimilarityMatrices } from "./explorer/charts/TextSimilarityMatrices.jsx";
import BenchmarkSection from "./explorer/sections/BenchmarkSection.jsx";
import StandardCLIPDiagram from "./explorer/sections/StandardCLIPDiagram.jsx";
import HeroAnnotation from "./explorer/components/HeroAnnotation.jsx";
import CategoryRow from "./explorer/components/CategoryRow.jsx";
import LaionExamplesGrid from "./explorer/components/LaionExamplesGrid.jsx";
import RichCaptionExplorer from "./explorer/components/RichCaptionExplorer.jsx";
import SectionNav from "./explorer/components/SectionNav.jsx";
import CaptionDecomposition from "./explorer/components/CaptionDecomposition.jsx";

// ─── Page Shell ─────────────────────────────────────────────────────────────

export default function CinemaCLIPExplorer() {
  const [activeSection, setActiveSection] = useState("framing");
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const currentSection = SECTIONS.find((s) => s.id === activeSection);
  const {Prose, Visual} = LAYOUT_CONTAINERS;

  return (
    <div style={PAGE_SHELL.container}>
      <LeftRailTOC />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* ════════════════════════════════════════════════════════════════════
          1. HERO
          ════════════════════════════════════════════════════════════════════ */}

      <div id="intro" style={{...Prose, paddingTop: 96}}>
        <img class="center-image" src="./assets/OZU_Wordmark_White.svg"></img>
        <h1 style={{...STYLES.H1, paddingBottom: SPACE[3]}}>Introducing CinemaCLIP</h1>
        <p style={{ ...STYLES.Subtitle, marginBottom: SPACE[3] }}>
          A hybrid CLIP model and taxonomy for the visual language of cinema
        </p>
        <HeroByline />
      </div>

      <div style={Prose}>
        {/* intro prose */}
        <p style={STYLES.Paragraph}>
          At OZU, our goal is to build ML systems that deeply understand the art of cinema and visual story telling. In pursuing that goal, we noticed a qualitative gap; existing ML models that bridge natural language and vision massively underperform when tasked with understanding cinematic concepts compared to humans, especially domain experts like cinematographers, editors, and directors.
        </p>
        <p style={STYLES.Paragraph}>
          To understand this gap, we first carefully created a taxonomy of cinematic concepts by working with industry specialists. We then evaluated existing models, as well as our own Cinema family of models against a new set of benchmark datasets.
        </p>
        <p style={STYLES.Paragraph}>
          What we found matched our qualitative assessment: evaluating leading CLIP models against these datasets shows a fundamental gap in their understanding of the nuances of visual grammar. Furthermore, model scale alone does not solve this problem; models up to 28× larger still fail to capture the structure of cinematic visual language. This limits their usefulness in real-world professional video tasks where understanding visual language is critical.
        </p>
        <p style={STYLES.Paragraph}>
          The result of our work is a new model: CinemaCLIP, and a collection of 22 datasets that represent an extensive taxonomy of professional visual language.
        </p>
      </div>

      {/* Overall Accuracy Dot Plot */}
      <div data-visual style={{ ...Visual}}>
        <OverallAccuracyDotPlot />
      </div>

      <div style={Prose}>
        <p style={STYLES.Paragraph}>
          CinemaCLIP is a hybrid CLIP model that pairs zero-shot inference with specialised classification heads, outperforming existing CLIP models as well as state of the art Vision Language models in both zero shot inference and one shot classification tasks.
        </p>
      </div>


      {/* ════════════════════════════════════════════════════════════════════
          2. THE PROBLEM
          ════════════════════════════════════════════════════════════════════ */}

      <div id="visual-language" style={Prose}>
        <h2 style={STYLES.H2}>
          The Problem
        </h2>
        <p style={STYLES.Paragraph}>
          Cinematographers, photographers, editors and directors all use very specific language to describe imagery on the job. However their language can be fuzzy, and not all cinematographers and photographers share the same opinion of when a "close up shot" begins and a "medium shot" ends. Furthermore, industry terms of art often attempt to capture multiple competing visual concepts which lead to poor machine interpretability. 
        </p>

        <p style={STYLES.Paragraph}>
          Modern models are trained on internet scale data, of which most captions are from non-experts, and do a poor or even incorrect job of describing an image. The result are models which have a fuzzy understanding of these specific terms of art, and are less effective when used in professional contexts.
        </p>
        <p style={STYLES.Paragraph}>
          For many use cases, internet scale data along with correct training formulations result in models that outperform non-expert users. But these models also vastly underperform when compared to trained professionals. If your use case is to build intelligent tools for professionals, this gap in performance matters. 
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          3. THE GAP IN EXISTING APPROACHES
          ════════════════════════════════════════════════════════════════════ */}

      <div id="training" style={{ ...Prose }}>
        <h2 style={STYLES.H2}>The Gap In Existing Approaches</h2>
        <p style={STYLES.Paragraph}>
          CLIP learns by matching images to captions. Whether it's the original contrastive loss or SigLIP's sigmoid formulation, the fundamental task is the same: given a batch of images and captions, figure out which caption goes with which image.
        </p>
        <p style={STYLES.Paragraph}>
          Crucially, what's in the caption limits what the model can learn. Existing captions from industry standard datasets capture a sliver of what's meaningful in the image. Specifically, this is an information problem: existing captions don’t consistently encode information (e.g. shot size, camera angle, composition), so the model never learns them.  The limitation is not the architecture but the dataset. Let's look at some sample data and captions to show what this really means, and why they don't work.
        </p>
      </div>

      {/* LAION examples */}
      <div data-visual style={Visual}>
        <LaionExamplesGrid />
        <p style={STYLES.FigureCaption}>
          Examples of cinematic vs non-cinematic images from LAION, shown with their original web-scraped captions
        </p>
      </div>

      <div style={Prose}>
        <p style={STYLES.Paragraph}>
          The most obvious antidote to this problem is richer captions. <a href="https://arxiv.org/abs/2403.15378" target="_blank" rel="noopener noreferrer" style={STYLES.Link}>LongCLIP</a> showed that most CLIP models have an effective context length of ~20 tokens (a side effect of existing datasets) and demonstrated gains from extending the actual and effective context length. In the VLM space, <a href="https://arxiv.org/abs/2409.17146" target="_blank" rel="noopener noreferrer" style={STYLES.Link}>Pixmo (Molmo)</a> took this further to great effect with exhaustive captions for pre-training:
        </p>
      </div>

      {/* Rich caption explorer (Pixmo / ShareGPT4V) */}
      <div data-visual style={Visual}>
        <RichCaptionExplorer />
        <p style={STYLES.FigureCaption}>
          Rich essay length captions from Pixmo and ShareGPT4V-COCO.
        </p>
      </div>

      <div style={Prose}>
        <p style={STYLES.Paragraph}>
          To the untrained eye, these captions appear exhaustive, but there's often little to no information about the visual grammar of the image from the perspective of a domain expert / industry professional.
        </p>
        <p style={STYLES.Paragraph}>
          Instead of matching concise captions to images, you're now matching essays to images. While this solves the information problem in principle, it introduces a precision problem: the model can satisfy the objective by matching whichever visual features are easiest, and ignore the rest, without ever learning structured visual concepts. 
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          4. THE SOLUTION: DECOMPOSITION
          ════════════════════════════════════════════════════════════════════ */}

      <div id="decomposition" style={Prose}>
        <h2 style={STYLES.H2}>The Solution: Decomposition</h2>
        <p style={STYLES.Paragraph}>
          Visual language has a grammar, and this grammar is structured and consists of visual concepts that are mutually exclusive. Instead of combining them all into a single long caption, we treat this as a multi-task problem, running 8 parallel tasks that all attend to distinct aspects of the image.
        </p>
        <p style={STYLES.Paragraph}>
          In other words, instead of asking one question: "what's in this image?", we ask multiple focused questions, such as:
        </p>
        <ul style={STYLES.List}>
          <li style={STYLES.ListItem}>What is the shot type?</li>
          <li style={STYLES.ListItem}>What is the camera angle?</li>
          <li style={STYLES.ListItem}>What is the lighting style?</li>
          <li style={STYLES.ListItem}>What is the composition?</li>
        </ul>
        <p style={STYLES.Paragraph}>
          Each is learned independently, but from the same underlying image.
        </p>
        <p style={STYLES.Paragraph}>
          Not only is this much more readable to the human eye, it's a fundamentally better training formulation. Each task provides a clean, unambiguous training signal, preventing the model from collapsing multiple concepts into a single representation. Adding this structure allows us to learn multiple dimensions of the same image concurrently, leading to a ~14% improvement over the basic single caption formulation. This approach is also compatible with learning <a href="https://github.com/jaisidhsingh/CoN-CLIP?tab=readme-ov-file" target="_blank" rel="noopener noreferrer" style={STYLES.Link}>negation</a>, offering additional opportunities for the model to learn appropriate features.
        </p>
      </div>

      {/* Caption decomposition comparison */}
      <div data-visual style={{ ...Visual, marginBottom: SPACE[7] }}>
        <CaptionDecomposition />
        <p style={STYLES.FigureCaption}>
          Breaking down 1 long caption with lots of signal into 8 distinct ones that each capture a unique aspect of the image.
        </p>
      </div>

      <div style={Prose}>
        <p style={STYLES.Paragraph}>
          In addition to 8 captioning tasks, we create 23 dedicated classification task heads - a combination of single-label, multi-label, and binary classifiers per concept. The data for these tasks was generated automatically by specialist in-house models we've developed over the past few years. See our <a href="https://youtu.be/7aYgLALc_24?t=32741" target="_blank" rel="noopener noreferrer" style={STYLES.Link}>CVEU 2021</a> talk from 2021 for more details.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          5. TAXONOMY BROWSER
          ════════════════════════════════════════════════════════════════════ */}

      <div id="taxonomy" style={Prose}>
        <h2 style={STYLES.H2}>Taxonomy</h2>
        <p style={STYLES.Paragraph}>
          Placeholder: introduce the taxonomy of cinematic concepts and how to explore it below.
        </p>
      </div>

      <div data-visual style={Visual}>
        <SectionNav
          sections={SECTIONS}
          activeId={activeSection}
          onSelect={setActiveSection}
        />

        <div style={{ ...dividerStyle, margin: `${SPACE[5]}px 0 ${SPACE[7]}px` }} />

        {currentSection && (
          <div>
            {currentSection.description && (
              <p style={STYLES.Description}>
                {currentSection.description}
              </p>
            )}
            {currentSection.categories.map((cat, i) => (
              <div key={cat.id}>
                {i > 0 && (
                  <div style={{ ...dividerStyle, marginBottom: SPACE.blockGap }} />
                )}
                <CategoryRow category={cat} sectionId={currentSection.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          6. DATASET SIZE
          ════════════════════════════════════════════════════════════════════ */}

      <div id="dataset" style={Prose}>
        <h2 style={STYLES.H2}>Dataset Size</h2>
        <p style={STYLES.Paragraph}>
          As seen above, CinemaCLIP is trained on cinematic data. Our dataset consists of a validation set hand labelled (and re-labelled multiple times) by domain experts. We fine tuned domain-specific teacher models for individual aspects of visual grammar (e.g. shot type, lighting, composition), and used them to generate high-confidence labels at scale. Finally, we generated our training datasets via our teacher models. We encourage you to check out our talk at <a href="https://youtu.be/7aYgLALc_24?t=32741" target="_blank" rel="noopener noreferrer" style={STYLES.Link}>CVEU 2021</a> for more details regarding the process.
        </p>
        <p style={STYLES.Paragraph}>
          Our dataset consisted of 750k samples with human labelled tags. Another 750k images from DataComp were labelled by our teacher models to maintain a 50-50 split of generalist labels and visual domain expertise to preserve generalist knowledge in the models.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
            ARCHITECTURE
          ════════════════════════════════════════════════════════════════════ */}

      <div id="architecture" style={Prose}>
        <h2 style={STYLES.H2}>Architecture</h2>
        <p style={STYLES.Paragraph}>
          Given the use cases for CinemaCLIP, we chose <code style={STYLES.InlineCode}>MobileCLIP-S1</code> - a modern clip architecture that can be deployed on edge devices, and run faster than realtime. During development of CinemaCLIP, we've had the privilege of running inference across petabytes of video archives in various data centers and compute environments. 
        </p>
        <p style={STYLES.Paragraph}>
          This process is expensive and time consuming, and running models capable of fast inference on cheaper hardware is a huge win and enables analysis of very large archives in reasonable time for reasonable costs. This also enables local inference, for on set, and even in camera use cases. 
        </p>
        <p style={STYLES.Paragraph}>
          <code style={STYLES.InlineCode}>MobileCLIP-S1</code> is designed to run on Apple Neural Engine, a hardware accelerated inference chip shipped with phones, laptops and desktop systems. It balances strong out of the box performance with size. 
        </p>
        <p style={STYLES.Paragraph}>
          The capability for on device model deployment and integration into native applications allows inference to run where video resides and on available compute, be it cloud based video archives, local production or post production storage networks, or near-line local device storage.  
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
            Ablations
          ════════════════════════════════════════════════════════════════════ */}

      <div id="ablations" style={Prose}>
        <h3 style={STYLES.H3}>Fine-Tuning Scope</h3>
        <p style={STYLES.Paragraph}>
          Given that any pretrained clip model consists of 2 components, a text encoder and vision encoder, we ran ablations to determine how much of each encoder to unfreeze for training. Our intuition is as follows - expert text captions are formulated differently than non expert captions. Additionally, cinematic images have a different distribution - shots are typically darker, and consist of more diverse compositions compared to product shots, advertisements and social media images which dominate the internet scale data.
        </p>
        <p style={STYLES.Paragraph}>
          We curated a subsection of our main dataset and ran ablations across the text encoder and vision encoder to determine which layers to unfreeze. 
        </p>
        <ul style={STYLES.List}>
          <li style={STYLES.ListItem}>Text: Projection + last 2 attention blocks</li>
          <li style={STYLES.ListItem}>Vision: Projection + last 5 attention blocks</li>
        </ul>
        <p style={STYLES.Paragraph}>
          These findings scale with larger datasets. 
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          AUGMENTATIONS
          ════════════════════════════════════════════════════════════════════ */}
      <div id="augmentations" style={LAYOUT_CONTAINERS.Prose}>
        <h3 style={STYLES.H3}>
          Augmentations
        </h3>
        <p style={STYLES.Paragraph}>
          Augmentations were applied only on the text side. Every image augmentation applied may be relevant for one task, but undermines performance in another. Cinematic content is shot with intention, and augmentations destroy the salient information and build invariances where we don't want them. 
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          Model Soup
          ════════════════════════════════════════════════════════════════════ */}
      <div id="training-formulation" style={Prose}>
        <h3 style={STYLES.H3}>
          Model Soup
        </h3>
        <p style={STYLES.Paragraph}>
          Finally, we weight blend our resulting model with the pretrained model - 75% of our new fine tuned weights with 25% of the pretrained model. This last step ensures we retain generalist performance. Without it, our fine tuned model alone would perform 1-2% better on cinematic tasks but lose ~10% on general purpose tasks. Alpha mixing allows us to retain 14% better cinematic knowledge with next to no loss in general purpose performance. 
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          7. EVALUATIONS
          ════════════════════════════════════════════════════════════════════ */}
      <div id="evaluations" style={Prose}>
        <h2 style={STYLES.H2}>
          Evaluations
        </h2>
      </div>

      {/* Cinematic Evals */}
      <div id="cinematic-evals" style={Prose}>
        <h3 style={STYLES.H3}>Cinematic Evals</h3>
        <p style={STYLES.Paragraph}>
          Here is a categorical comparison of CinemaCLIP against the leading existing CLIP models and select VLMs across all our cinematography datasets. The solid dots denote zero-shot performance, and the rounded dots classifier performance. Overall, we do better than all compared models in every category.
        </p>
      </div>

      <div id="benchmarks" data-visual style={Visual}>
        <BenchmarkSection />
      </div>

      {/* Generalist Evals */}
      <div id="generalist-evals" style={Prose}>
        <h3 style={STYLES.H3}>Generalist Evals</h3>
        <p style={STYLES.Paragraph}>
          We don't want to over-specialize in cinematic expertise. It's important for our models to retain a wide understanding of general concepts so that existing functionality is retained. To that end, we validate our dataset and multi-task training approach by using existing datasets as proxies for generalist tasks.
        </p>
      </div>

      <div data-visual style={{ ...Visual, marginBottom: 0 }}>
        <GeneralKnowledgeCharts />
        <p style={STYLES.FigureCaption}>
          Proxies for 'general' knowledge retention. Even though we didn't actively attend to these concepts exhaustively, we improved performance on general tasks users care about.
        </p>
      </div>

      <div style={Prose}>
        <p style={STYLES.Paragraph}>
          Note that there are many different groups of concepts within these datasets, like emotion, wardrobe, etc, many of which could command dedicated taxonomies and tasks themselves (and indeed, there are many publicly available datasets in many of these domains), but we lumped them all into two tasks as our focus was teaching CLIP the language of cinema. Coverage of these concepts is far from exhaustive throughout the dataset. Regardless, we saw a notable improvement in accuracy across most of these tasks compared to the pre-trained model. CinemaCLIP retains good generalist knowledge, and we intentionally trade ~7% ImageNet accuracy for significantly improved performance on real-world visual tasks relevant to our users. 
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          9. TEXT EMBEDDING COMPARISONS (currently commented out)
          ════════════════════════════════════════════════════════════════════ */}

      {/* <div id="text-encoder" style={prose}>
        <h3 style={TYPE.h3}>Text Embedding Comparisons</h3>
        <p style={TYPE.body}></p>
      </div>
      <div style={visual}><CinematicSimilarityMatrices /></div>
      <div style={prose}><p style={TYPE.body}></p></div>
      <div style={visual}><NonCinematicSimilarityMatrices sectionIndex={0} /></div>
      <div style={prose}><p style={TYPE.body}></p></div>
      <div style={visual}>
        <NonCinematicSimilarityMatrices sectionIndex={1} />
        <p style={TYPE.figCaption}></p>
      </div> */}

      {/* ════════════════════════════════════════════════════════════════════
          10. CONCLUSION
          ════════════════════════════════════════════════════════════════════ */}

      <div id="conclusion" style={{ ...Prose, marginTop: SPACE.elementGap }}>
        <h2 style={STYLES.H2}>Conclusion</h2>
        <p style={STYLES.Paragraph}>
          CinemaCLIP is one part of a family of models and techniques that we built at OZU to understand the art of visual storytelling, and is the backbone for a suite of tools and processes that power OZU's state of the art narrative understanding systems.
        </p>
        <p style={STYLES.Paragraph}>
          It offers a demonstrable improvement over CLIP and VLM models for many industry professional use cases. Not only is it more accurate in understanding cinematic concepts, it can also be run on commodity hardware on edge, at greatly faster than real-time rates. This enables opportunities like real-time video search and retrieval systems, live camera assist systems, on set validation, and more.
        </p>
        <p style={STYLES.Paragraph}>
          Our key contributions besides the model itself are two-fold: a dataset and ontology of visual language at the frame level, and a novel training recipe to add domain expertise to CLIP models while mitigating catastrophic forgetting. We believe this recipe is generic and can be adapted to other domains as well.
        </p>
        <p style={STYLES.Paragraph}>
          Stay tuned for more.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          11. TECHNICAL ADDENDUM
          ════════════════════════════════════════════════════════════════════ */}

      <div id="technical-addendum" style={{...Prose, paddingTop: 400}}>
        <h1 style={STYLES.H1}>
          Technical Addendum
        </h1>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
            Note on Generalist Knowledge
          ════════════════════════════════════════════════════════════════════ */}
      <div style={Prose}>
        <h2 style={STYLES.H2}>Note on Generalist Knowledge</h2>
        <p style={STYLES.Paragraph}>
          Zero-shot accuracy on ImageNet-1K is a popular proxy for measuring a CLIP model's general performance. ImageNet is an object centric dataset and doesn't capture a lot of the nuance our users care about in real world usage. For instance, about 12% of ImageNet consists of dog breeds. There is little to no representation for the color of objects, materials, and textures.
        </p>
        <p style={STYLES.Paragraph}>
           Additionally, zero-shot evaluation on ImageNet uses 82 prompts per class, and many of these use terms that are part of the cinematic language, but used here without intentionality. For example, some of the prompts use the words <a href="https://github.com/mlfoundations/open_clip/blob/54c9754a94baacac5b2d9b1c76318078d48912af/src/open_clip/zero_shot_metadata.py#L41" target="_blank" rel="noopener noreferrer" style={STYLES.Link}>"close up"</a>, <a href="https://github.com/mlfoundations/open_clip/blob/54c9754a94baacac5b2d9b1c76318078d48912af/src/open_clip/zero_shot_metadata.py#L24" target="_blank" rel="noopener noreferrer" style={STYLES.Link}>"black and white photo"</a> for <em>each</em> concept.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
            Ablations
          ════════════════════════════════════════════════════════════════════ */}
      <div id="ablations-addendum" style={Prose}>
        <h2 style={STYLES.H2}>Ablations</h2>
      </div>

      <div style={Prose}>
        <h3 style={STYLES.H3}>
          Model Soup
        </h3>
        <p style={STYLES.Paragraph}>
          We tried blending our fine-tuned model with the pre-trained one at various <code style={STYLES.InlineCode}>alpha</code>s and found that <code style={STYLES.InlineCode}>0.75</code> (75% fine-tuned weights, 25% pre-trained) was the best combination. Not only did we perform better at ImageNet, which was expected, but we also had superior zero-shot performance on cinematic tasks. The classifier heads were slightly worse (88% vs. 89%), which was a reasonable tradeoff.
        </p>
      </div>

      <AblationTable
        headers={["", "ImageNet 0-Shot Top-1", "Cinematic 0-Shot", "Cinematic Classifiers"]}
        rows={[
          ["α = 0.5",  "—", "—", "—"],
          ["α = 0.75", "63.4%", "82.2%", "87.5%"],
          ["α = 1.0",  "57%", "—", "88.5%"],
        ]}
        highlightRow={1}
      />

      <div style={Prose}>
        <h3 style={STYLES.H3}>
          Teacher Model Labelling Threshold
        </h3>
        <p style={STYLES.Paragraph}>
          Our 23 teacher models, all classifiers, provided labels for 6/8 tasks. Being classifiers, we experimented with the confidence threshold at which we decide to use the model's prediction as part of the caption. Higher confidence levels meant more high quality labels, but too high a confidence would lead to too many empty captions. In practice, 85% worked best.
        </p>
      </div>

      <AblationTable
        headers={["Threshold", "Cinematic 0-Shot"]}
        rows={[
          ["0.0",  "74.9%"],
          ["0.5",  "79.5%"],
          ["0.6",  "79.0%"],
          ["0.7",  "80.2%"],
          ["0.8",  "81.0%"],
          ["0.85", "82.2%"],
        ]}
        highlightRow={5}
      />

      <div style={Prose}>
        <h3 style={STYLES.H3}>
          No. of Contrastive Tasks
        </h3>
        <p style={STYLES.Paragraph}>
          We experimented with the ideal no. of tasks to include in our multi-task formulation. Generally, adding more tasks led to better performance. Beyond 6 cinematic tasks, there were no notable gains, and with the confidence thresholding mentioned above, we ended up with over 40% of a batch having empty captions. For our formulation, 6 was the right balance. If one were to extend this to more domains, we expect performance to generally increase as long as they are well formulated. We only added expertise in the cinematic domain, and it'd be interesting to see how far this can be pushed - could we train models with a hundred domain expert tasks at once?
        </p>
      </div>

      <AblationTable
        headers={["No. of Captions", "ImageNet 0-Shot Top-1", "Cinematic 0-Shot"]}
        rows={[
          ["2", "65.6%", "72.4%"],
          ["3", "65.4%", "72.8%"],
          ["8", "63.4%", "82.2%"],
          ["22", "60.5", "82.7%"],
        ]}
        highlightRow={-1}
      />

      <div style={Prose}>
        <h3 style={STYLES.H3}>
          Batch Size
        </h3>
        <p style={STYLES.Paragraph}>
          Our effective batch size was 1,152 images with 9,216 captions per batch. We were bound by our hardware constraints (3x RTX 3090s w/ 24GB VRAM each) and were unable to test if performance increases further with larger batches. Most CLIP research and practitioners' experiences suggest that larger batch sizes are better, but there hasn't been a systematic study of the effect of batch size when <em>fine-tuning</em> CLIP models.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
            Training Dynamics & Hyperparameters
          ════════════════════════════════════════════════════════════════════ */}
      <div id="hyperparams" style={Prose}>
        <h2 style={STYLES.H2}>Training Dynamics & Hyperparameters</h2>
        <p style={STYLES.Paragraph}>
          Fine-tuning CLIP models can be fiddly. Many parameters need to be tuned specifically to the architecture you're training. We needed to be judicious about the areas we dove deeper into. We were systematic about some ablations, as elaborated above, and lacked bandwidth to go deeper on other hyperparameters. Here is our assessment of the most significant hyperparameters:
        </p>
      </div>
      <HyperparameterTable rows={HYPERPARAMETER_ROWS} />

      {/* Footer divider */}
      <div style={Prose}>
        <div style={{ ...dividerStyle, margin: `${SPACE[7]}px 0 ${SPACE[5]}px` }} />
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────
// Extracted for readability. These are page-specific, not reusable.

function HeroByline() {
  const S = PAGE_SHELL.heroByline;
  const separator = <span style={S.separator}>·</span>;
  return (
    <div style={S.row}>
      <span>Rahul Somani, Anton Marini, Damian Stewart</span>
      {separator}
      <a href="https://github.com/placeholder" target="_blank" rel="noopener noreferrer" style={S.link}>
        GitHub &#8599;
      </a>
      {separator}
      <a href="https://huggingface.co/placeholder" target="_blank" rel="noopener noreferrer" style={S.link}>
        HuggingFace &#8599;
      </a>
    </div>
  );
}

function HyperparameterTable({ rows }) {
  const S = PAGE_SHELL.hyperparameterTable;

  // Merge successive identical Notes cells
  const noteSpans = new Array(rows.length).fill(null);
  for (let i = 0; i < rows.length; ) {
    const notes = rows[i][2];
    let j = i;
    while (j + 1 < rows.length && rows[j + 1][2] === notes) j += 1;
    noteSpans[i] = { rowSpan: j - i + 1, notes };
    i = j + 1;
  }

  return (
    <div style={{ ...LAYOUT_CONTAINERS.Visual, marginBottom: SPACE[7] }}>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={{ ...S.th, width: `${S.col1Pct}%` }}>Parameter</th>
            <th style={{ ...S.th, width: `${S.col2Pct}%`, textAlign: "center" }}>Value</th>
            <th style={{ ...S.th, width: `${S.col3Pct}%`, paddingLeft: S.notesPaddingLeft }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([param, value], i) => {
            const cell = noteSpans[i];
            const isGroupEnd = cell && cell.rowSpan === 1 && i + 1 < rows.length && noteSpans[i + 1];
            return (
              <tr key={i} style={i % 2 === 1 ? S.rowEven : undefined}>
                <td style={{
                  ...S.td, ...S.paramTd,
                  ...(isGroupEnd && { borderBottom: S.groupBorder }),
                }}>{param}</td>
                <td style={{
                  ...S.td, ...S.valueTd,
                  ...(isGroupEnd && { borderBottom: S.groupBorder }),
                }}>{value}</td>
                {cell ? (
                  <td rowSpan={cell.rowSpan} style={{
                    ...S.td, ...S.notesTd,
                    paddingLeft: S.notesPaddingLeft,
                    lineHeight: S.notesLineHeight,
                    ...(isGroupEnd && { borderBottom: S.groupBorder }),
                  }}>
                    {cell.notes}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AblationTable({ headers, rows, highlightRow }) {
  const S = PAGE_SHELL.ablationTable;
  return (
    <div style={{ ...LAYOUT_CONTAINERS.Prose, padding: S.padding, display: "flex", justifyContent: "center" }}>
      <table style={S.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={S.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    ...S.td,
                    ...(j === 0 ? S.rowHeader : (i === highlightRow ? S.highlight : S.value)),
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
