import OpenAI from 'openai';

export interface HabitSuggestion {
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  instructions: string[];
  energyLevel: 'low' | 'medium' | 'high';
}

export class OpenAIClient {
  private client: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey || process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // For client-side usage
      });
    }
  }

  /**
   * Generate personalized habit suggestions based on user context
   */
  async generateHabitSuggestions(
    energyLevel: number,
    userHistory?: string[],
    preferredCategories?: string[]
  ): Promise<HabitSuggestion[]> {
    if (!this.client) {
      console.warn('OpenAI client not initialized - using fallback suggestions');
      return this.getFallbackSuggestions(energyLevel);
    }

    try {
      const energyCategory = this.getEnergyCategory(energyLevel);
      const prompt = this.buildPrompt(energyLevel, energyCategory, userHistory, preferredCategories);

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in habit formation and personal development. Generate practical, actionable micro-habits that can be completed in 1-5 minutes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return this.getFallbackSuggestions(energyLevel);
      }

      return this.parseSuggestions(content, energyCategory);
    } catch (error) {
      console.error('Error generating habit suggestions:', error);
      return this.getFallbackSuggestions(energyLevel);
    }
  }

  /**
   * Build the prompt for OpenAI
   */
  private buildPrompt(
    energyLevel: number,
    energyCategory: 'low' | 'medium' | 'high',
    userHistory?: string[],
    preferredCategories?: string[]
  ): string {
    const energyDescription = this.getEnergyDescription(energyLevel);

    let prompt = `Generate 3 unique micro-habit suggestions for someone with ${energyDescription} energy level (${energyCategory} energy).

Each suggestion should:
- Take 1-5 minutes to complete
- Be immediately actionable
- Align with their current energy state
- Include step-by-step instructions
- Belong to a relevant category (Mindfulness, Movement, Wellness, Organization, Creativity, Learning)

Format each suggestion as:
NAME: [Brief, actionable name]
DESCRIPTION: [1-2 sentence description]
CATEGORY: [One category from the list above]
DURATION: [X minutes]
INSTRUCTIONS: [Numbered steps]

Separate each suggestion with ---`;

    if (preferredCategories && preferredCategories.length > 0) {
      prompt += `\n\nUser prefers these categories: ${preferredCategories.join(', ')}`;
    }

    if (userHistory && userHistory.length > 0) {
      prompt += `\n\nUser has previously completed: ${userHistory.slice(-5).join(', ')}`;
    }

    return prompt;
  }

  /**
   * Parse OpenAI response into structured suggestions
   */
  private parseSuggestions(content: string, energyCategory: 'low' | 'medium' | 'high'): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    const sections = content.split('---').map(s => s.trim()).filter(s => s.length > 0);

    for (const section of sections) {
      try {
        const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        let name = '';
        let description = '';
        let category = '';
        let durationMinutes = 3;
        const instructions: string[] = [];

        for (const line of lines) {
          if (line.startsWith('NAME:')) {
            name = line.replace('NAME:', '').trim();
          } else if (line.startsWith('DESCRIPTION:')) {
            description = line.replace('DESCRIPTION:', '').trim();
          } else if (line.startsWith('CATEGORY:')) {
            category = line.replace('CATEGORY:', '').trim();
          } else if (line.startsWith('DURATION:')) {
            const durationMatch = line.match(/(\d+)/);
            if (durationMatch) {
              durationMinutes = parseInt(durationMatch[1]);
            }
          } else if (line.startsWith('INSTRUCTIONS:')) {
            // Instructions will be in subsequent lines
            continue;
          } else if (line.match(/^\d+\./)) {
            // This is an instruction step
            instructions.push(line.replace(/^\d+\.\s*/, '').trim());
          }
        }

        if (name && description && category) {
          suggestions.push({
            name,
            description,
            category,
            durationMinutes: Math.min(Math.max(durationMinutes, 1), 5), // Clamp to 1-5 minutes
            instructions,
            energyLevel: energyCategory
          });
        }
      } catch (error) {
        console.warn('Error parsing suggestion section:', error);
      }
    }

    // Ensure we have at least one suggestion
    if (suggestions.length === 0) {
      return this.getFallbackSuggestionsByCategory(energyCategory);
    }

    return suggestions.slice(0, 3); // Return up to 3 suggestions
  }

  /**
   * Get fallback suggestions when OpenAI is not available
   */
  private getFallbackSuggestions(energyLevel: number): HabitSuggestion[] {
    const energyCategory = this.getEnergyCategory(energyLevel);
    return this.getFallbackSuggestionsByCategory(energyCategory);
  }

  /**
   * Get fallback suggestions by energy category
   */
  private getFallbackSuggestionsByCategory(energyCategory: 'low' | 'medium' | 'high'): HabitSuggestion[] {
    const fallbacks = {
      low: [
        {
          name: 'Gentle Breathing Exercise',
          description: 'A calming breathing technique to restore your energy',
          category: 'Mindfulness',
          durationMinutes: 3,
          instructions: [
            'Find a comfortable seated position',
            'Place one hand on your chest and one on your belly',
            'Inhale slowly through your nose for 4 counts',
            'Exhale slowly through your mouth for 6 counts',
            'Repeat for 3 minutes'
          ],
          energyLevel: 'low' as const
        },
        {
          name: 'Gratitude Reflection',
          description: 'Take a moment to appreciate the positive aspects of your day',
          category: 'Mindfulness',
          durationMinutes: 2,
          instructions: [
            'Close your eyes and take a deep breath',
            'Think of 3 things you\'re grateful for today',
            'Spend 30 seconds on each one',
            'Open your eyes feeling more positive'
          ],
          energyLevel: 'low' as const
        }
      ],
      medium: [
        {
          name: 'Desk Stretches',
          description: 'Quick stretches to energize your body while at your desk',
          category: 'Movement',
          durationMinutes: 3,
          instructions: [
            'Stand up from your chair',
            'Reach your arms overhead and stretch',
            'Roll your shoulders backward 5 times',
            'Do 10 gentle neck rolls',
            'Shake out your arms and legs'
          ],
          energyLevel: 'medium' as const
        },
        {
          name: 'Mindful Hydration',
          description: 'Drink water mindfully to refresh your system',
          category: 'Wellness',
          durationMinutes: 2,
          instructions: [
            'Get a glass of water',
            'Take 3 slow, mindful sips',
            'Notice how the water feels in your mouth',
            'Feel the refreshment spread through your body'
          ],
          energyLevel: 'medium' as const
        }
      ],
      high: [
        {
          name: 'Quick Creative Burst',
          description: 'Channel your high energy into a creative idea dump',
          category: 'Creativity',
          durationMinutes: 3,
          instructions: [
            'Grab a notebook or open a note app',
            'Set a 2-minute timer',
            'Write down every idea that comes to mind',
            'Don\'t judge or filter - just write',
            'Review and circle your favorite idea'
          ],
          energyLevel: 'high' as const
        },
        {
          name: 'Learning Micro-Lesson',
          description: 'Feed your curiosity with a quick learning bite',
          category: 'Learning',
          durationMinutes: 3,
          instructions: [
            'Pick a topic you\'re curious about',
            'Read or watch something for 2 minutes',
            'Write down one key insight',
            'Think about how to apply it today'
          ],
          energyLevel: 'high' as const
        }
      ]
    };

    return fallbacks[energyCategory] || fallbacks.medium;
  }

  /**
   * Convert energy level number to category
   */
  private getEnergyCategory(energyLevel: number): 'low' | 'medium' | 'high' {
    if (energyLevel <= 2) return 'low';
    if (energyLevel <= 3) return 'medium';
    return 'high';
  }

  /**
   * Get descriptive text for energy level
   */
  private getEnergyDescription(energyLevel: number): string {
    const descriptions = {
      1: 'very low',
      2: 'low',
      3: 'moderate',
      4: 'high',
      5: 'very high'
    };
    return descriptions[energyLevel as keyof typeof descriptions] || 'moderate';
  }
}

